/**
 * Reference KYC flow generator.
 *
 * Produces a compact, static reference document for developers describing a
 * typical KYC flow: steps, fields, states and synthetic examples. It performs
 * no identity verification, collects and stores no user data, makes no network
 * calls, and must never be treated as compliance or legal advice.
 */

export type KycFlowPhase = 'collect' | 'verify' | 'record'

export type KycFlowStep = {
  id: string
  name: string
  phase: KycFlowPhase
  action: string
  output: string
}

export type KycFlowExample = { stepId: string; input: string; result: string }

export type KycFlow = {
  title: string
  disclaimer: string
  steps: KycFlowStep[]
  fields: string[]
  states: string[]
  examples: KycFlowExample[]
}

export type KycFlowRequest = {
  audience?: unknown
  format?: unknown
}

export type KycFlowError = {
  code: 'KYC_FLOW_INVALID_INPUT'
  missingFields: string[]
}

export function isKycFlowError(value: unknown): value is KycFlowError {
  return typeof value === 'object' && value !== null && (value as KycFlowError).code === 'KYC_FLOW_INVALID_INPUT'
}

// Kept deliberately short: JSON.stringify of the whole flow must stay under 1800 chars.
const TITLE = 'KYC 参考流程（仅供开发参考）'

const DISCLAIMER =
  '仅供开发参考：示意流程，不构成合规结论或法律意见，示例数据为虚构占位符，不采集不存储个人数据。'

const STEPS: KycFlowStep[] = [
  { id: 'S1', name: '接收基本信息', phase: 'collect', action: '校验字段格式', output: '信息占位记录' },
  { id: 'S2', name: '登记证件信息', phase: 'collect', action: '记录类型与掩码', output: '证件占位条目' },
  { id: 'S3', name: '名单风险筛查', phase: 'verify', action: '描述筛查接入点', output: '筛查结果标记' },
  { id: 'S4', name: '规则评估', phase: 'verify', action: '校验完整性与等级', output: '风险等级示例' },
  { id: 'S5', name: '归档与状态流转', phase: 'record', action: '写入状态机', output: '案例最终状态' },
]

const FIELDS = ['customerId', 'fullName', 'dateOfBirth', 'idType', 'idNumber', 'address', 'riskLevel', 'status']

const STATES = ['pending', 'in_review', 'verified', 'rejected', 'expired']

const EXAMPLES: KycFlowExample[] = [
  { stepId: 'S1', input: 'customerId=CUST-0001', result: '格式校验通过' },
  { stepId: 'S2', input: 'idType=ID_CARD,idNumber=XX-XXXXXXX', result: '登记为掩码占位' },
  { stepId: 'S5', input: 'caseId=CASE-0001', result: '状态置为 verified' },
]

function validate(request: KycFlowRequest): KycFlowError | null {
  const missingFields: string[] = []
  if (typeof request.audience !== 'string' || !request.audience.trim()) missingFields.push('audience')
  if (missingFields.length > 0) return { code: 'KYC_FLOW_INVALID_INPUT', missingFields }
  if (request.format !== undefined && typeof request.format !== 'string') {
    return { code: 'KYC_FLOW_INVALID_INPUT', missingFields: ['format'] }
  }
  return null
}

/**
 * Returns a compact developer-facing KYC reference flow, or a
 * KYC_FLOW_INVALID_INPUT error object when the request is invalid.
 */
export function generateKycFlow(request: KycFlowRequest): KycFlow | KycFlowError {
  const invalid = validate(request)
  if (invalid) return invalid
  return {
    title: TITLE,
    disclaimer: DISCLAIMER,
    steps: STEPS.map((step) => ({ ...step })),
    fields: [...FIELDS],
    states: [...STATES],
    examples: EXAMPLES.map((example) => ({ ...example })),
  }
}
