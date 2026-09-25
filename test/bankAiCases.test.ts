import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { SLIDE_SECTIONS, bankAiCases, renderDeck, renderSlide } from '../src/bankAiCases.ts'

const deckPath = new URL('../docs/global-top10-bank-ai.md', import.meta.url)

/** Splits a Marp deck into slides, dropping the front matter and the cover slide. */
function bankSlides(markdown: string): string[] {
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n/, '')
  return body.split(/\n---\n/).map((s) => s.trim()).filter((s) => s.startsWith('## '))
}

test('covers ten distinct banks, ranked 1 to 10, one case each', () => {
  assert.equal(bankAiCases.length, 10)
  assert.deepEqual(bankAiCases.map((c) => c.rank), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  assert.equal(new Set(bankAiCases.map((c) => c.bankEn)).size, 10)
  for (const c of bankAiCases) assert.ok(c.caseName.trim(), `${c.bankEn} needs a case name`)
})

test('every case has business scenario, tech architecture and business benefits', () => {
  for (const c of bankAiCases) {
    for (const [name, items] of [
      ['businessScenario', c.businessScenario],
      ['techArchitecture', c.techArchitecture],
      ['businessBenefits', c.businessBenefits],
    ] as const) {
      assert.ok(items.length > 0, `${c.bankEn}.${name} is empty`)
      for (const item of items) assert.ok(item.trim(), `${c.bankEn}.${name} has a blank item`)
    }
  }
})

test('a rendered slide contains all three sections in order', () => {
  const slide = renderSlide(bankAiCases[0])
  const positions = SLIDE_SECTIONS.map((s) => slide.indexOf(`### ${s}`))
  assert.ok(positions.every((p) => p >= 0))
  assert.deepEqual([...positions].sort((a, b) => a - b), positions)
})

test('the deck file has exactly one slide per bank, each with the three sections', () => {
  const slides = bankSlides(readFileSync(deckPath, 'utf8'))
  assert.equal(slides.length, bankAiCases.length)
  bankAiCases.forEach((c, i) => {
    const slide = slides[i]
    assert.ok(slide.includes(c.bank) && slide.includes(c.bankEn), `slide ${i + 1} should be about ${c.bankEn}`)
    for (const section of SLIDE_SECTIONS) {
      const count = slide.split(`### ${section}`).length - 1
      assert.equal(count, 1, `slide ${i + 1} (${c.bankEn}) must contain "${section}" exactly once`)
    }
  })
})

test('the deck file is in sync with the case data', () => {
  assert.equal(readFileSync(deckPath, 'utf8').trimEnd(), renderDeck().trimEnd())
})
