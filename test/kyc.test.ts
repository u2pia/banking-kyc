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
