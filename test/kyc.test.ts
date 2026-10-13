import assert from 'node:assert/strict'
import { test } from 'node:test'
import { exportKycReportMarkdown, openCase, type Customer } from '../src/kyc.ts'

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

/** Counts pipes that are NOT escaped, i.e. the real column separators. */
function countColumnSeparators(line: string): number {
  return (line.match(/(?<!\\)\|/g) ?? []).length
}

const expectedPlainMarkdown = [
  '# KYC Report',
  '',
  '## Customer C-42',
  '',
  '| Field | Value |',
  '| --- | --- |',
  '| ID | C-42 |',
  '| Full name | Ada Lovelace |',
  '| Date of birth | 1815-12-10 |',
  '| Document number | — |',
  '| Status | verified |',
  '',
  '> Disclaimer: this report is a deterministic rendering of an existing KYC summary. It is for reference only and does not constitute a compliance conclusion or legal opinion.',
  ''
].join('\n')

test('export of a normal value is byte-for-byte unchanged', () => {
  const customer: Customer = {
    id: 'C-42',
    fullName: 'Ada Lovelace',
    dateOfBirth: '1815-12-10',
    status: 'verified'
  }

  assert.equal(exportKycReportMarkdown(customer), expectedPlainMarkdown)
})

test('a pipe inside a field value does not add a column', () => {
  const customer: Customer = {
    id: 'C-42',
    fullName: 'Ada | Lovelace',
    dateOfBirth: '1815-12-10',
    status: 'verified'
  }
  const lines = exportKycReportMarkdown(customer).split('\n')
  const nameLine = lines.find((line) => line.startsWith('| Full name |'))

  assert.ok(nameLine !== undefined, 'expected a Full name row')
  assert.equal(countColumnSeparators(nameLine), 3)
  assert.ok(nameLine.includes('Ada \\| Lovelace'))
})

test('a line break inside a field value does not add a row', () => {
  const baseline: Customer = {
    id: 'C-42',
    fullName: 'Ada Lovelace',
    dateOfBirth: '1815-12-10',
    status: 'verified'
  }
  const withNewline: Customer = { ...baseline, fullName: 'Ada\nLovelace' }

  const baselineLines = exportKycReportMarkdown(baseline).split('\n')
  const lines = exportKycReportMarkdown(withNewline).split('\n')

  assert.equal(lines.length, baselineLines.length)
  const nameLine = lines.find((line) => line.startsWith('| Full name |'))
  assert.ok(nameLine !== undefined, 'expected a Full name row')
  assert.equal(countColumnSeparators(nameLine), 3)
  assert.ok(nameLine.includes('Ada\\nLovelace'))
})

test('hostile characters in every field keep every table row at 3 separators', () => {
  const customer: Customer = {
    id: 'C-|1\nX',
    fullName: 'Ada | "Lovelace" | <b>\r\n',
    dateOfBirth: '18|15\n12-10',
    documentNumber: 'DOC|\n123',
    status: 'verified'
  }
  const tableRows = exportKycReportMarkdown(customer)
    .split('\n')
    .filter((line) => line.startsWith('|'))

  assert.equal(tableRows.length, 7)
  for (const row of tableRows) {
    assert.equal(countColumnSeparators(row), 3, `bad row: ${row}`)
  }
})
