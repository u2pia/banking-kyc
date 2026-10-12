/**
 * 全球市值前五银行的 KYC AI 应用报告生成器。
 *
 * 输出一份确定性的 Markdown 文本：标题、市值排名口径说明（含时点与来源）、
 * 五家银行各一节，每节列出至少 2 个具体的 KYC 场景 AI 应用点。
 *
 * 边界说明：
 * - 不接入实时行情、不抓取外部网页、不发起任何网络请求；
 * - 不处理、不存储、不输出任何真实个人身份信息或客户 KYC 数据；
 * - 输出为公开资料整理，不构成监管批准、法律意见或正式合规结论；
 * - 缺少市值排名时点或来源说明时，拒绝输出排名结果。
 */

export type BankKycAiEntry = {
  /** 市值排名（1 起） */
  rank: number
  bank: string
  bankEn: string
  country: string
  /** 市值排名依据说明（口径与量级，非实时报价） */
  marketCapNote: string
  /** KYC 场景中的具体 AI 应用点，至少 2 条 */
  kycAiApplications: string[]
  /** 资料来源说明 */
  sourceNote: string
}

export type ReportRankingBasis = {
  /** 排名数据时点，例如 '2025-06-30' */
  asOf: string
  /** 排名来源说明 */
  source: string
  /** 排名口径说明 */
  methodology: string
}

export type TopFiveBankKycAiReportError = {
  code: 'TOP_FIVE_BANK_KYC_AI_INVALID_RANKING_BASIS'
  missingFields: string[]
}

export function isReportError(value: unknown): value is TopFiveBankKycAiReportError {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as TopFiveBankKycAiReportError).code === 'TOP_FIVE_BANK_KYC_AI_INVALID_RANKING_BASIS'
  )
}

/** 市值排名的数据时点与来源说明：缺失时不输出排名结果。 */
export const RANKING_BASIS: ReportRankingBasis = {
  asOf: '2025-06-30',
  source: '各上市银行公开披露的股本与收盘价换算的市值统计（公开市值榜单与公司投资者关系页面整理）',
  methodology:
    '按普通股市值（本币折算为美元后的近似量级）由高到低排序；不同数据商因汇率、股本口径与统计时点差异，名次可能存在出入，本表仅用于说明性对比。',
}

export const REPORT_TITLE = '# 全球市值前五大银行的 KYC AI 应用报告'

export const REPORT_DISCLAIMER =
  '本报告基于公开资料整理，仅供内部研究与学习参考；不构成监管批准、法律意见或正式合规结论，' +
  '也不针对任何具体客户或具体交易作出尽调、审批或合规判断。文中不包含任何真实个人身份信息或客户 KYC 数据，' +
  '所举客户与案例均为示意性描述。AI 应用点均来自银行年报、公开新闻稿与公开案例报道，落地范围与效果以各银行最新披露为准。'

export const topFiveBanksKycAi: BankKycAiEntry[] = [
  {
    rank: 1,
    bank: '摩根大通',
    bankEn: 'JPMorgan Chase',
    country: '美国',
    marketCapNote: '市值量级在全球上市银行中长期居首，主要由零售与商业银行、公司与投行板块支撑。',
    kycAiApplications: [
      '客户身份文件智能审核：以 OCR 与自然语言处理抽取驾照、护照、开户文件中的字段，并与申报信息自动比对，减少人工录入与复核工时；异常件转人工，模型不单独作出准入决定。',
      'KYC 尽职调查材料自动汇编：借助企业级生成式 AI 平台（LLM Suite）检索内部政策与公开企业信息，生成客户尽调档案初稿与关系图谱摘要，供合规人员复核确认。',
      '客户风险等级动态评估：机器学习模型结合客户属性、交易行为与地域风险，输出 KYC 风险分层建议，触发差异化的定期复核（Periodic Review）节奏。',
      '可疑活动监测与预警降噪：以 AI 模型替代部分规则引擎，压缩反洗钱告警量，将调查资源集中于高风险客户，人工保留最终判定权。',
    ],
    sourceNote: '摩根大通投资者日材料、股东信与公开案例报道',
  },
  {
    rank: 2,
    bank: '中国工商银行',
    bankEn: 'ICBC',
    country: '中国',
    marketCapNote: '按公开市值统计长期位居全球银行前列，股本规模庞大，市值受 A 股与 H 股价格共同影响。',
    kycAiApplications: [
      '开户环节人脸识别与活体检测：远程与柜面开户中以生物特征识别辅助核验证件与本人一致性，结果作为人工审核的输入而非唯一依据。',
      '企业客户 KYC 信息智能核验：以 AI 抽取营业执照、股权结构图与受益所有人信息，自动比对工商与制裁名单数据，生成受益所有人识别建议。',
      '金融大模型辅助合规问答：依托企业级大模型体系（「工银智涌」）为一线人员提供 KYC 政策检索、话术建议与工单摘要，降低政策理解偏差。',
      '客户信息持续治理：机器学习识别存量客户资料缺失与失效（证件过期、地址变更），自动生成补件任务清单并推送客户经理跟进。',
    ],
    sourceNote: '工商银行年报、金融科技公开发布与公开报道',
  },
  {
    rank: 3,
    bank: '美国银行',
    bankEn: 'Bank of America',
    country: '美国',
    marketCapNote: '按公开市值统计位列全球银行前列，零售存款基础与财富管理业务对估值贡献显著。',
    kycAiApplications: [
      '数字开户的证件影像识别：移动端上传证件后由 AI 完成质量检测、字段抽取与伪造痕迹识别，提升一次性通过率并减少人工退回。',
      '客户身份持续监测：以机器学习模型跟踪客户行为与外部信息变化，识别需要重新核验（Refresh）或加强尽调（EDD）的账户并生成队列。',
      '对话式助理承载合规话术：Erica 智能助理在客户咨询开户与资料更新时提供标准化指引与自助补件入口，敏感操作仍走既有身份核验流程。',
      'KYC 文档与名单筛查提效：自然语言处理用于负面新闻与制裁名单命中项的自动摘要与相似性归并，辅助合规分析人员判断误报。',
    ],
    sourceNote: '美国银行新闻稿、季度业绩材料与公开报道',
  },
  {
    rank: 4,
    bank: '中国农业银行',
    bankEn: 'Agricultural Bank of China',
    country: '中国',
    marketCapNote: '按公开市值统计位居全球银行前列，县域与涉农客户基础广阔，市值随 A 股与 H 股价格波动。',
    kycAiApplications: [
      '县域远程开户的身份核验：结合人脸识别、证件 OCR 与设备风险信号，为网点覆盖不足地区的客户提供线上 KYC，异常情形回落至人工面签。',
      '农户与小微主体画像建模：以机器学习融合涉农政务数据、结算流水与保险信息，生成客户风险画像，支撑差异化的尽调深度与授信审查，KYC 结论由人工确认。',
      '客户尽调文书辅助生成：借助行内大模型助手（ChatABC）为客户经理生成尽调访谈提纲、资料清单与档案摘要初稿。',
      '名单筛查误报归并：以 AI 对同名人、音近名与多语种转写命中项做相似度聚类，减少重复人工排查。',
    ],
    sourceNote: '农业银行年报、三农金融业务披露与公开报道',
  },
  {
    rank: 5,
    bank: '中国建设银行',
    bankEn: 'China Construction Bank',
    country: '中国',
    marketCapNote: '按公开市值统计位居全球银行前列，按揭与普惠小微信贷资产规模对估值影响较大。',
    kycAiApplications: [
      '受益所有人自动穿透识别：以图算法与企业知识图谱解析多层股权与关联关系，输出实际控制人链条建议，人工复核后写入 KYC 档案。',
      '普惠线上业务的实时身份核验：在「惠懂你」等线上小微信贷流程中，以 OCR、活体检测与反欺诈模型完成企业主身份与经营真实性初筛。',
      '客户风险等级智能重检：机器学习模型对存量客户进行定期风险重评，自动划分复核优先级并提示需要补充资料的账户。',
      '可疑交易与客户行为异常联动：AI 模型将交易异常信号与 KYC 档案信息关联，生成结构化案件说明，供反洗钱调查人员使用。',
    ],
    sourceNote: '建设银行年报、普惠金融与金融科技专题披露',
  },
]

/** 每节标题后需要出现 KYC / AI 关键词的字符窗口，与验收口径保持一致。 */
export const KEYWORD_WINDOW = 2000

function basisError(basis: ReportRankingBasis | undefined): TopFiveBankKycAiReportError | null {
  const missingFields: string[] = []
  if (!basis) return { code: 'TOP_FIVE_BANK_KYC_AI_INVALID_RANKING_BASIS', missingFields: ['asOf', 'source', 'methodology'] }
  if (typeof basis.asOf !== 'string' || !basis.asOf.trim()) missingFields.push('asOf')
  if (typeof basis.source !== 'string' || !basis.source.trim()) missingFields.push('source')
  if (typeof basis.methodology !== 'string' || !basis.methodology.trim()) missingFields.push('methodology')
  return missingFields.length > 0 ? { code: 'TOP_FIVE_BANK_KYC_AI_INVALID_RANKING_BASIS', missingFields } : null
}

function entriesError(entries: BankKycAiEntry[]): TopFiveBankKycAiReportError | null {
  if (entries.length !== 5) return { code: 'TOP_FIVE_BANK_KYC_AI_INVALID_RANKING_BASIS', missingFields: ['entries.length'] }
  for (const entry of entries) {
    if (entry.kycAiApplications.length < 2) return { code: 'TOP_FIVE_BANK_KYC_AI_INVALID_RANKING_BASIS', missingFields: [`entries[${entry.rank}].kycAiApplications`] }
    if (!entry.bank.trim() || !entry.bankEn.trim() || !entry.sourceNote.trim() || !entry.marketCapNote.trim()) {
      return { code: 'TOP_FIVE_BANK_KYC_AI_INVALID_RANKING_BASIS', missingFields: [`entries[${entry.rank}]`] }
    }
  }
  return null
}

/** 渲染排名与口径说明段落。 */
export function renderRankingSection(basis: ReportRankingBasis, entries: BankKycAiEntry[]): string {
  const rows = entries.map((entry) => `${entry.rank}. ${entry.bank}（${entry.bankEn}，${entry.country}）`)
  return [
    '### 市值排名口径与时点',
    '',
    `截至 ${basis.asOf}（排名数据时点），按公开统计的普通股市值，本报告选取的五家银行依次为：`,
    '',
    ...rows,
    '',
    `- 排名来源：${basis.source}`,
    `- 排名口径：${basis.methodology}`,
    '',
    '说明：本报告的排名仅为公开资料的整理结果，非实时行情；如需引用请以数据商或银行官方披露为准。',
  ].join('\n')
}

/** 渲染单家银行章节。 */
export function renderBankSection(entry: BankKycAiEntry): string {
  return [
    `## ${entry.rank}. ${entry.bank}（${entry.bankEn}）`,
    '',
    `- 国家 / 地区：${entry.country}`,
    `- 市值说明：${entry.marketCapNote}`,
    '',
    `### KYC 场景中的 AI 应用`,
    '',
    ...entry.kycAiApplications.map((item, index) => `${index + 1}. ${item}`),
    '',
    `> 上述 AI 应用点均为公开资料整理，用于说明 KYC 流程中 AI 的典型介入方式；不构成监管批准、法律意见或合规结论，也不代表对该银行合规有效性的评价。`,
    '',
    `来源：${entry.sourceNote}`,
  ].join('\n')
}

/**
 * 生成「全球市值前五大银行 KYC AI 应用」Markdown 报告。
 *
 * 缺少排名时点、来源或口径说明，或银行条目不满足约束时，返回错误对象而非排名结果。
 */
export function generateTopFiveBankKycAiReport(
  options: { basis?: ReportRankingBasis; entries?: BankKycAiEntry[] } = {},
): string | TopFiveBankKycAiReportError {
  const basis = options.basis ?? RANKING_BASIS
  const entries = options.entries ?? topFiveBanksKycAi
  const invalid = basisError(basis) ?? entriesError(entries)
  if (invalid) return invalid

  const overview = [
    '本报告梳理按市值排名位居全球前五的银行在 KYC（Know Your Customer，了解你的客户）场景中引入 AI 的典型做法，',
    '覆盖身份核验、尽职调查、风险分层、名单筛查与持续监测等环节。所有条目均来自公开披露，用于横向对比与技术选型参考。',
  ].join('')

  return [
    REPORT_TITLE,
    '',
    overview,
    '',
    REPORT_DISCLAIMER,
    '',
    renderRankingSection(basis, entries),
    '',
    entries.map(renderBankSection).join('\n\n'),
    '',
    '### 小结',
    '',
    [
      '- 五家银行的 KYC AI 应用集中在三类环节：开户身份核验（OCR、活体检测、证件防伪）、尽职调查提效（文档抽取、关系图谱、材料初稿生成）、持续监测（风险分层、名单筛查误报归并、异常行为预警）。',
      '- 普遍采用「AI 辅助 + 人工判定」的人机协同模式：模型输出建议与优先级，准入、风险等级与可疑活动结论由合规人员确认，并保留可审计留痕。',
      '- 企业级生成式 AI 平台（统一网关、内部知识库检索、权限与输出审计）正在成为 KYC 文书类工作的共同底座，数据不出行是常见前提。',
      '- 后续如需引用具体成效数据，应回到各银行年报与官方披露核对；本报告不提供实时市值行情，也不构成合规结论。',
    ].join('\n'),
    '',
  ].join('\n')
}
