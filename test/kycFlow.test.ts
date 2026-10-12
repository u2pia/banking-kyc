import assert from 'node:assert/strict'
import { test } from 'node:test'
import { generateKycFlow, isKycFlowError, type KycFlow } from '../src/kycFlow.ts'

const request = { audience: 'developer', format: 'compact' }

function flow(): KycFlow {
  const result = generateKycFlow(request)
  assert.ok(!isKycFlowError(result), 'expected a flow, got an error')
  return result
}

test('compact developer flow has all required top-level fields', () => {
  const result = flow()
  for (const key of ['title', 'disclaimer', 'steps', 'fields', 'states', 'examples'] as const) {
    assert.ok(key in result, `missing top-level field ${key}`)
  }
  assert.ok(result.title.trim().length > 0)
  assert.ok(result.disclaimer.trim().length > 0)
  assert.ok(Array.isArray(result.steps) && result.steps.length > 0)
  assert.ok(Array.isArray(result.fields) && result.fields.length > 0)
  assert.ok(Array.isArray(result.states) && result.states.length > 0)
  assert.ok(Array.isArray(result.examples) && result.examples.length > 0)
})

test('steps are between 3 and 8 and each is fully described', () => {
  const { steps } = flow()
  assert.ok(steps.length >= 3 && steps.length <= 8, `steps length ${steps.length} out of range`)
  for (const step of steps) {
    for (const key of ['id', 'name', 'phase', 'action', 'output'] as const) {
      assert.equal(typeof step[key], 'string', `step.${key} must be a string`)
      assert.ok(step[key].trim().length > 0, `step.${key} is empty`)
    }
  }
})

test('steps cover collect, verify and record phases at least once each', () => {
  const phases = new Set(flow().steps.map((step) => step.phase))
  for (const phase of ['collect', 'verify', 'record'] as const) {
    assert.ok(phases.has(phase), `missing phase ${phase}`)
  }
})

test('compact output stays within the size budget', () => {
  assert.ok(JSON.stringify(flow()).length <= 1800)
})

test('output contains no document numbers, phone numbers or email addresses', () => {
  const text = JSON.stringify(flow())
  assert.ok(!/\d{17}[\dXx]/u.test(text), 'looks like an 18-digit document number')
  assert.ok(!/1\d{10}/u.test(text), 'looks like an 11-digit mobile number')
  assert.ok(!text.includes('@'), 'output must not contain @')
})

test('generation is deterministic and does not mutate between calls', () => {
  const first = flow()
  const second = flow()
  assert.deepEqual(first, second)
  first.steps[0].name = 'mutated'
  assert.notEqual(flow().steps[0].name, 'mutated')
})

test('an empty request reports KYC_FLOW_INVALID_INPUT with missing audience', () => {
  const result = generateKycFlow({})
  assert.ok(isKycFlowError(result))
  assert.equal(result.code, 'KYC_FLOW_INVALID_INPUT')
  assert.ok(result.missingFields.includes('audience'))
})

test('a blank audience is rejected', () => {
  const result = generateKycFlow({ audience: '   ' })
  assert.ok(isKycFlowError(result))
  assert.ok(result.missingFields.includes('audience'))
})

test('title and disclaimer mark the flow as developer reference only', () => {
  const result = flow()
  assert.ok(result.title.includes('仅供开发参考'))
  assert.ok(result.disclaimer.includes('不构成合规结论或法律意见'))
})
