import assert from 'node:assert/strict'
import { posix } from 'node:path'
import { test } from 'node:test'
import { inflateRawSync } from 'node:zlib'
import { BODY_FONT_PT, bankAiRecords, buildPptx, cardBox, cardParagraphs, estimateTextHeightPt, slideLayout } from '../src/bankAiSlide.ts'

/** Reads a ZIP package the way a PPTX parser does: through the central directory. */
function readZip(bytes: Buffer): Map<string, string> {
  const end = bytes.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]))
  assert.ok(end >= 0, 'missing end of central directory')
  const count = bytes.readUInt16LE(end + 10)
  let p = bytes.readUInt32LE(end + 16)
  const parts = new Map<string, string>()
  for (let i = 0; i < count; i++) {
    assert.equal(bytes.readUInt32LE(p), 0x02014b50, 'bad central directory entry')
    const method = bytes.readUInt16LE(p + 10)
    const size = bytes.readUInt32LE(p + 20)
    const nameLength = bytes.readUInt16LE(p + 28)
    const skip = nameLength + bytes.readUInt16LE(p + 30) + bytes.readUInt16LE(p + 32)
    const local = bytes.readUInt32LE(p + 42)
    const name = bytes.toString('utf8', p + 46, p + 46 + nameLength)
    const start = local + 30 + bytes.readUInt16LE(local + 26) + bytes.readUInt16LE(local + 28)
    const raw = bytes.subarray(start, start + size)
    parts.set(name, (method === 8 ? inflateRawSync(raw) : raw).toString('utf8'))
    p += 46 + skip
  }
  return parts
}

const unescapeXml = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')

/** Checks that every opening tag has a matching closing tag. */
function assertBalanced(name: string, xml: string) {
  const stack: string[] = []
  for (const [, close, tag, selfClose] of xml.replace(/<\?xml[^>]*\?>/, '').matchAll(/<(\/?)([A-Za-z_][\w:.-]*)(?:\s[^>]*?)?(\/?)>/g)) {
    if (selfClose) continue
    if (close) assert.equal(stack.pop(), tag, `${name}: unexpected </${tag}>`)
    else stack.push(tag)
  }
  assert.equal(stack.length, 0, `${name}: unclosed <${stack.at(-1)}>`)
}

const hasFigure = (text: string) => /[0-9０-９%％]|[零一二两三四五六七八九十百千万亿]/u.test(text)

const deck = readZip(Buffer.from(buildPptx()))
const slideXml = deck.get('ppt/slides/slide1.xml') ?? ''
const slideText = [...slideXml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => unescapeXml(m[1])).join('\n')

test('the generated pptx contains exactly one slide', () => {
  assert.deepEqual([...deck.keys()].filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name)), ['ppt/slides/slide1.xml'])
  assert.equal((deck.get('ppt/presentation.xml') ?? '').match(/<p:sldId /g)?.length, 1)
  assert.equal((deck.get('ppt/_rels/presentation.xml.rels') ?? '').match(/relationships\/slide"/g)?.length, 1)
})

test('package parts are balanced XML and every declared part and relationship resolves', () => {
  for (const [name, xml] of deck) assertBalanced(name, xml)
  for (const [, part] of (deck.get('[Content_Types].xml') ?? '').matchAll(/PartName="\/([^"]+)"/g)) {
    assert.ok(deck.has(part), `content type declared for missing part ${part}`)
  }
  for (const [name, xml] of deck) {
    if (!name.endsWith('.rels')) continue
    const base = posix.dirname(posix.dirname(name))
    for (const [, target] of xml.matchAll(/Target="([^"]+)"/g)) {
      const resolved = posix.normalize(posix.join(base, target))
      assert.ok(deck.has(resolved), `${name} points to missing part ${resolved}`)
    }
  }
})

test('the slide uses no pictures, so no bank logos or third-party images', () => {
  assert.ok(![...deck.keys()].some((name) => name.startsWith('ppt/media/')))
  assert.ok(!slideXml.includes('<p:pic'))
})

test('the data source has exactly ten complete records with distinct banks', () => {
  assert.equal(bankAiRecords.length, 10)
  for (const r of bankAiRecords) {
    for (const field of ['bank', 'businessArea', 'aiTechnology', 'businessBenefit'] as const) {
      assert.equal(typeof r[field], 'string', `${r.bank}.${field} must be a string`)
      assert.ok(r[field].trim(), `${r.bank}.${field} is empty`)
    }
  }
  assert.equal(new Set(bankAiRecords.map((r) => r.bank)).size, 10)
})

test('records cover at least four business areas and four AI technology categories', () => {
  assert.ok(new Set(bankAiRecords.map((r) => r.businessArea)).size >= 4)
  assert.ok(new Set(bankAiRecords.map((r) => r.aiTechnology)).size >= 4)
})

test('benefits with figures cite a public source; qualitative benefits contain no figures', () => {
  for (const r of bankAiRecords) {
    assert.ok('source' in r && typeof r.source === 'string', `${r.bank} needs a source field`)
    if (hasFigure(r.businessBenefit)) assert.ok(r.source.trim(), `${r.bank}: a benefit with figures needs a source`)
    if (!r.source.trim() || r.businessBenefit.includes('定性描述')) {
      assert.ok(!hasFigure(r.businessBenefit), `${r.bank}: a qualitative benefit must not contain figures`)
    }
  }
})

test('the slide text shows every bank with its business area, AI technology and benefit', () => {
  for (const r of bankAiRecords) {
    for (const value of [r.bank, r.businessArea, r.aiTechnology, r.businessBenefit]) {
      assert.ok(slideText.includes(value), `slide is missing "${value}"`)
    }
  }
})

test('text is at least 10pt and each card fits its content', () => {
  for (const [, size] of slideXml.matchAll(/ sz="(\d+)"/g)) assert.ok(Number(size) >= BODY_FONT_PT * 100, `font size ${Number(size) / 100}pt is below 10pt`)
  bankAiRecords.forEach((r, i) => {
    const height = estimateTextHeightPt(cardParagraphs(r, i), slideLayout.cardTextWidthPt)
    assert.ok(height <= slideLayout.cardTextHeightPt, `${r.bank} card text (${height.toFixed(1)}pt) overflows ${slideLayout.cardTextHeightPt.toFixed(1)}pt`)
  })
})

test('every shape stays on the slide and cards do not overlap', () => {
  for (const [, x, y, cx, cy] of slideXml.matchAll(/<a:off x="(-?\d+)" y="(-?\d+)"\/><a:ext cx="(\d+)" cy="(\d+)"\/>/g)) {
    assert.ok(Number(x) >= 0 && Number(y) >= 0, `shape at ${x},${y} starts off the slide`)
    assert.ok(Number(x) + Number(cx) <= slideLayout.width && Number(y) + Number(cy) <= slideLayout.height, `shape at ${x},${y} runs off the slide`)
  }
  const boxes = bankAiRecords.map((_, i) => cardBox(i))
  boxes.forEach((a, i) => boxes.slice(i + 1).forEach((b) => {
    const apart = a.x + a.cx <= b.x || b.x + b.cx <= a.x || a.y + a.cy <= b.y || b.y + b.cy <= a.y
    assert.ok(apart, 'two cards overlap')
  }))
})

test('generation is deterministic', () => {
  assert.deepEqual(buildPptx(), buildPptx())
})
