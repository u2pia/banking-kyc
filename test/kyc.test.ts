import assert from 'node:assert/strict'
import { test } from 'node:test'
import { exportKycReportMarkdown, openCase } from '../src/kyc.ts'

test('a new case starts pending', () => {
  assert.equal(openCase({ id: 'C-1', fullName: ' Ada Lovelace ', dateOfBirth: '1815-12-10' }).status, 'pending')
})

test('id and name are required', () => {
  assert.throws(() => openCase({ id: '', fullName: 'Ada', dateOfBirth: '1815-12-10' }))
  assert.throws(() => openCase({ id: 'C-1', fullName: ' ', dateOfBirth: '1815-12-10' }))
})

test('kyc markdown export returns a non-empty string', () => {
  const fixture = { ...openCase({ id: 'FIX-1', fullName: 'Test Persona', dateOfBirth: '1900-01-01' }), status: 'verified' as const }
  const markdown = exportKycReportMarkdown(fixture)

  assert.equal(typeof markdown, 'string')
  assert.ok(markdown.trim().length > 0)
  assert.ok(markdown.trimStart().startsWith('#'))
})

/** Byte-for-byte expected output for the plain-value fixture, as produced before escaping was added. */
const PLAIN_FIXTURE = { id: 'C-1', fullName: 'Ada Lovelace', dateOfBirth: '1815-12-10', documentNumber: 'DOC-1', status: 'verified' as const }

const PLAIN_EXPECTED = [
  '# KYC Report',
  '',
  '## Customer C-1',
  '',
  '| Field | Value |',
  '| --- | --- |',
  '| ID | C-1 |',
  '| Full name | Ada Lovelace |',
  '| Date of birth | 1815-12-10 |',
  '| Document number | DOC-1 |',
  '| Status | verified |',
  '',
  '> Disclaimer: this report is a deterministic rendering of an existing KYC summary. It is for reference only and does not constitute a compliance conclusion or legal opinion.',
  ''
].join('\n')

test('plain values are exported byte-for-byte unchanged', () => {
  assert.equal(exportKycReportMarkdown(PLAIN_FIXTURE), PLAIN_EXPECTED)
})

test('missing document number renders the em dash placeholder', () => {
  const { documentNumber: _documentNumber, ...rest } = PLAIN_FIXTURE
  assert.ok(exportKycReportMarkdown({ ...rest }).includes('| Document number | — |'))
})

test('a pipe inside fullName keeps exactly three pipes on the row', () => {
  const markdown = exportKycReportMarkdown({ ...PLAIN_FIXTURE, fullName: 'Ada | Lovelace' })
  const row = markdown.split('\n').find((line) => line.startsWith('| Full name |'))

  assert.ok(row)
  assert.equal(row!.split('|').length - 1, 3)
})

test('every table row keeps the same column count regardless of field content', () => {
  const hostile = {
    id: 'C|2\nx',
    fullName: 'Ada |\nLovelace',
    dateOfBirth: '1815-12-10',
    documentNumber: 'DOC|2\r\n2',
    status: 'verified' as const
  }
  const markdown = exportKycReportMarkdown(hostile)
  const tableRows = markdown.split('\n').filter((line) => line.startsWith('|'))

  assert.equal(tableRows.length, 7)
  for (const row of tableRows) {
    assert.equal(row.split('|').length - 1, 3, `unexpected column count in row: ${row}`)
  }
})

test('a newline inside fullName does not add a table row', () => {
  const markdown = exportKycReportMarkdown({ ...PLAIN_FIXTURE, fullName: 'Ada\nLovelace' })
  const lineCount = markdown.split('\n').length
  const plainLineCount = PLAIN_EXPECTED.split('\n').length

  assert.equal(lineCount, plainLineCount)
  assert.ok(markdown.split('\n').some((line) => line.startsWith('| Full name |') && line.endsWith(' |')))
  assert.equal(markdown.split('\n').filter((line) => line.startsWith('|')).length, 7)
})

test('carriage returns in field values do not add rows either', () => {
  const markdown = exportKycReportMarkdown({ ...PLAIN_FIXTURE, fullName: 'Ada\r\nLovelace' })
  assert.equal(markdown.split('\n').length, PLAIN_EXPECTED.split('\n').length)
  assert.ok(!markdown.includes('\r'))
})

test('exporter does not HTML-escape values', () => {
  const markdown = exportKycReportMarkdown({ ...PLAIN_FIXTURE, fullName: 'Ada <b>&"Lovelace"</b>' })
  assert.ok(markdown.includes('| Full name | Ada <b>&"Lovelace"</b> |'))
})
