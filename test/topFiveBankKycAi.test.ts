import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  KEYWORD_WINDOW,
  RANKING_BASIS,
  generateTopFiveBankKycAiReport,
  isReportError,
  topFiveBanksKycAi,
} from '../src/topFiveBankKycAi.ts'

const report = generateTopFiveBankKycAiReport()

test('generateTopFiveBankKycAiReport returns a non-empty Markdown string starting with "# "', () => {
  assert.equal(isReportError(report), false)
  assert.equal(typeof report, 'string')
  const text = report as string
  assert.ok(text.length > 0, 'report must not be empty')
  assert.ok(text.startsWith('# '), 'report must start with a top-level Markdown heading')
})

test('the report mentions KYC and AI', () => {
  const text = report as string
  assert.ok(text.includes('KYC'), 'report must include KYC')
  assert.ok(text.includes('AI'), 'report must include AI')
})

test('the report has exactly five second-level headings, one per bank', () => {
  const text = report as string
  const headings = text.match(/^## /gmu) ?? []
  assert.equal(headings.length, 5, 'report must contain exactly five "## " sections')
  assert.equal(topFiveBanksKycAi.length, 5)
  for (const entry of topFiveBanksKycAi) {
    const count = text.split(`## ${entry.rank}. ${entry.bank}（${entry.bankEn}）`).length - 1
    assert.equal(count, 1, `${entry.bankEn} must appear exactly once as a second-level heading`)
  }
})

test('each bank section mentions KYC and AI within the first 2000 characters', () => {
  const text = report as string
  const starts = [...text.matchAll(/^## /gmu)].map((match) => match.index as number)
  assert.equal(starts.length, 5)
  starts.forEach((start, index) => {
    const section = text.slice(start, start + KEYWORD_WINDOW)
    assert.ok(section.includes('KYC'), `section ${index + 1} must mention KYC within ${KEYWORD_WINDOW} chars`)
    assert.ok(section.includes('AI'), `section ${index + 1} must mention AI within ${KEYWORD_WINDOW} chars`)
  })
})

test('the report states the market-cap ranking with an as-of date and a source', () => {
  const text = report as string
  assert.ok(text.includes('市值'), 'report must explain the market-cap basis')
  assert.ok(text.includes('排名'), 'report must explain the ranking basis')
  assert.ok(text.includes('截至'), 'report must state an as-of date')
  assert.ok(text.includes(RANKING_BASIS.asOf), 'report must include the ranking as-of date')
  assert.ok(text.includes(RANKING_BASIS.source), 'report must include the ranking source')
})

test('the report contains no email-address-like strings', () => {
  const text = report as string
  const emailLike = /\S*@\S*\.\S*/u
  assert.equal(emailLike.test(text), false, `report must not contain an email-like fragment: ${text.match(emailLike)?.[0] ?? ''}`)
})

test('every bank section lists at least two concrete KYC AI applications and avoids unverifiable absolutes', () => {
  for (const entry of topFiveBanksKycAi) {
    assert.ok(entry.kycAiApplications.length >= 2, `${entry.bankEn} needs at least two KYC AI applications`)
    for (const item of entry.kycAiApplications) assert.ok(item.trim().length > 10, `${entry.bankEn} has a too-short application item`)
  }
  const text = report as string
  for (const phrase of ['最佳', '最领先', '保证合规', '完全合规']) {
    assert.equal(text.includes(phrase), false, `report must not contain the unverifiable claim "${phrase}"`)
  }
  assert.ok(text.includes('不构成'), 'report must carry a disclaimer negating compliance/legal conclusions')
  assert.ok(text.includes('法律意见'), 'report must state it is not legal advice')
  assert.ok(text.includes('不构成监管批准'), 'report must state it is not a regulatory approval')
})

test('the report carries no real personal identity or customer KYC data', () => {
  const text = report as string
  assert.equal(/[\w.+-]*@[\w-]*\.[\w.]*/u.test(text), false, 'no email-like identifiers')
  assert.equal(/\b\d{15,18}[0-9Xx]\b/u.test(text), false, 'no national-id-like numbers')
  assert.equal(/\b1[3-9]\d{9}\b/u.test(text), false, 'no mobile-phone-like numbers')
  for (const entry of topFiveBanksKycAi) {
    assert.ok(entry.kycAiApplications.join('\n').length > 40, `${entry.bankEn} section should be substantive`)
  }
})

test('missing ranking basis yields an error instead of a ranking result', () => {
  const invalid = generateTopFiveBankKycAiReport({ basis: { asOf: '', source: '', methodology: '' } })
  assert.equal(isReportError(invalid), true)
  assert.deepEqual((invalid as { missingFields: string[] }).missingFields, ['asOf', 'source', 'methodology'])

  const tooFew = generateTopFiveBankKycAiReport({ entries: topFiveBanksKycAi.slice(0, 4) })
  assert.equal(isReportError(tooFew), true)
})
