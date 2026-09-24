import assert from 'node:assert/strict'
import { test } from 'node:test'
import { openCase } from '../src/kyc.ts'

test('a new case starts pending', () => {
  assert.equal(openCase({ id: 'C-1', fullName: ' Ada Lovelace ', dateOfBirth: '1815-12-10' }).status, 'pending')
})

test('id and name are required', () => {
  assert.throws(() => openCase({ id: '', fullName: 'Ada', dateOfBirth: '1815-12-10' }))
  assert.throws(() => openCase({ id: 'C-1', fullName: ' ', dateOfBirth: '1815-12-10' }))
})
