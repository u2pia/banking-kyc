import { createZip } from './zip.ts'

/**
 * 全球十大银行 AI 应用 —— 单页科技风 PPTX 的数据源与生成器（无第三方依赖，可离线运行）。
 *
 * 银行范围：参考 The Banker「Top 1000 World Banks」一级资本排名前列银行，序号不代表排名。
 * 数据口径：含数值（百分比、金额、时长、次数）的收益必须附公开来源；
 *           无法确认数值的收益只写定性描述，并以「（定性描述）」标注。
 * 版权：幻灯片不使用任何银行 Logo 或第三方图片，装饰元素全部为原生形状。
 */

export type BankAiRecord = {
  bank: string
  bankEn: string
  businessArea: string
  aiTechnology: string
  businessBenefit: string
  /** 公开来源（URL 或公开报告名称）；收益含数值时必填 */
  source: string
}

export const bankAiRecords: BankAiRecord[] = [
  {
    bank: '中国工商银行',
    bankEn: 'ICBC',
    businessArea: '客户服务与运营办公',
    aiTechnology: '「工银智涌」千亿级金融大模型',
    businessBenefit: '大模型赋能坐席、客户经理与办公场景，提升员工作业效率（定性描述）',
    source: '中国工商银行年度报告（金融科技章节）',
  },
  {
    bank: '中国建设银行',
    bankEn: 'CCB',
    businessArea: '普惠金融（小微企业信贷）',
    aiTechnology: '大数据风控与机器学习信用评分',
    businessBenefit: '「惠懂你」线上完成小微融资申请与审批，扩大普惠信贷覆盖面（定性描述）',
    source: '中国建设银行年度报告（普惠金融章节）',
  },
  {
    bank: '中国农业银行',
    bankEn: 'ABC',
    businessArea: '县域三农信贷',
    aiTechnology: '农户画像与大数据授信模型',
    businessBenefit: '「惠农e贷」以线上授信服务农户，降低县域信贷人工尽调成本（定性描述）',
    source: '中国农业银行年度报告（三农金融章节）',
  },
  {
    bank: '中国银行',
    bankEn: 'Bank of China',
    businessArea: '跨境贸易金融',
    aiTechnology: 'OCR + 自然语言处理单证要素识别',
    businessBenefit: '辅助审单人员识别单证要素与不符点，缩短处理时效、降低操作风险（定性描述）',
    source: '中国银行年度报告（金融科技章节）',
  },
  {
    bank: '摩根大通',
    bankEn: 'JPMorgan Chase',
    businessArea: '风控与合规（法律文件审阅）',
    aiTechnology: '机器学习 + 自然语言处理（COiN 合同智能）',
    businessBenefit: 'COiN 数秒完成商业贷款协议审阅，替代每年约 36 万小时律师与信贷人员工作',
    source: 'Bloomberg（2017-02-28）：JPMorgan Software Does in Seconds What Took Lawyers 360,000 Hours',
  },
  {
    bank: '美国银行',
    bankEn: 'Bank of America',
    businessArea: '零售银行（移动端客户服务）',
    aiTechnology: '对话式 AI 虚拟助理 Erica（自然语言理解）',
    businessBenefit: 'Erica 自 2018 年上线至 2024 年 4 月累计交互超 20 亿次，服务客户约 4200 万',
    source: 'Bank of America 新闻稿（2024-04）：BofA’s Erica Surpasses 2 Billion Interactions',
  },
  {
    bank: '花旗集团',
    bankEn: 'Citigroup',
    businessArea: '员工效率与软件研发',
    aiTechnology: '生成式 AI 知识检索与文档摘要（Citi Assist / Citi Stylus）',
    businessBenefit: '员工更快检索内部政策、摘要比对文档，开发人员借助 AI 提升编码效率（定性描述）',
    source: 'Citigroup 新闻稿及公开报道（Citi Assist、Citi Stylus 推出）',
  },
  {
    bank: '汇丰银行',
    bankEn: 'HSBC',
    businessArea: '反洗钱（金融犯罪防控）',
    aiTechnology: '机器学习风险评分（Google Cloud AML AI）',
    businessBenefit: '识别的真实可疑活动增至原来的 2–4 倍，告警量下降约 60%，分析时间由数周缩至数天',
    source: 'Google Cloud 新闻稿（2023-06）：Anti-Money Laundering AI 发布（汇丰案例）',
  },
  {
    bank: '富国银行',
    bankEn: 'Wells Fargo',
    businessArea: '移动银行（数字渠道自助服务）',
    aiTechnology: '大语言模型虚拟助理 Fargo（隐私信息脱敏后调用 LLM）',
    businessBenefit: '2024 年 Fargo 完成约 2.45 亿次交互，敏感个人信息不送入大模型',
    source: 'VentureBeat（2025-01）：Wells Fargo’s AI assistant just crossed 245 million interactions',
  },
  {
    bank: '三菱日联金融集团',
    bankEn: 'MUFG',
    businessArea: '后台运营与文书处理',
    aiTechnology: '生成式 AI（企业级大语言模型）文书起草与内部问答',
    businessBenefit: '计划借助生成式 AI 每月减少约 22 万小时工作量（计划口径，非实际达成值）',
    source: 'MUFG 2023 年公开计划（日经新闻等媒体报道）',
  },
]

export const DECK_TITLE = '全球十大银行 AI 应用全景'

// ---- 版式（EMU：1 英寸 = 914400，1 磅 = 12700） ----

export type Box = { x: number; y: number; cx: number; cy: number }

const IN = 914400
const PT = 12700
const SLIDE = { cx: 12192000, cy: 6858000 }
const MARGIN = 0.25 * IN
const GAP = 0.1 * IN
const COLUMNS = 5
const ROWS = 2
const CARD_TOP = 1.1 * IN
const FOOTER_TOP = SLIDE.cy - 0.34 * IN
const CARD_W = Math.floor((SLIDE.cx - 2 * MARGIN - (COLUMNS - 1) * GAP) / COLUMNS)
const CARD_H = Math.floor((FOOTER_TOP - 0.05 * IN - CARD_TOP - (ROWS - 1) * GAP) / ROWS)
const CARD_INSET = { l: 0.07 * IN, t: 0.12 * IN, r: 0.07 * IN, b: 0.07 * IN }

export const BODY_FONT_PT = 10
const BANK_FONT_PT = 12

export const slideLayout = {
  width: SLIDE.cx,
  height: SLIDE.cy,
  cardTextWidthPt: (CARD_W - CARD_INSET.l - CARD_INSET.r) / PT,
  cardTextHeightPt: (CARD_H - CARD_INSET.t - CARD_INSET.b) / PT,
}

export function cardBox(index: number): Box {
  const col = index % COLUMNS
  const row = Math.floor(index / COLUMNS)
  return { x: MARGIN + col * (CARD_W + GAP), y: CARD_TOP + row * (CARD_H + GAP), cx: CARD_W, cy: CARD_H }
}

const COLOR = {
  bgStart: '050816',
  bgMid: '0B1033',
  bgEnd: '1B0F3F',
  grid: '3B82F6',
  card: '0E1638',
  cardLine: '3B82F6',
  cyan: '22D3EE',
  violet: 'A78BFA',
  blue: '60A5FA',
  purple: 'A855F7',
  white: 'FFFFFF',
  text: 'E2E8F0',
  muted: '94A3B8',
}

export type Run = { text: string; sizePt: number; color: string; bold?: boolean }
export type Paragraph = { runs: Run[]; spaceBeforePt: number }

/** 单张银行卡片的文本：序号 + 银行、英文名、业务领域、AI 技术、商业收益、来源。 */
export function cardParagraphs(record: BankAiRecord, index: number): Paragraph[] {
  const field = (label: string, color: string, value: string): Paragraph => ({
    spaceBeforePt: 4,
    runs: [
      { text: `${label} `, sizePt: BODY_FONT_PT, color, bold: true },
      { text: value, sizePt: BODY_FONT_PT, color: COLOR.text },
    ],
  })
  return [
    {
      spaceBeforePt: 0,
      runs: [
        { text: `${String(index + 1).padStart(2, '0')} `, sizePt: BANK_FONT_PT, color: COLOR.cyan, bold: true },
        { text: record.bank, sizePt: BANK_FONT_PT, color: COLOR.white, bold: true },
      ],
    },
    { spaceBeforePt: 0, runs: [{ text: record.bankEn, sizePt: BODY_FONT_PT, color: COLOR.muted }] },
    field('业务领域', COLOR.cyan, record.businessArea),
    field('AI 技术', COLOR.violet, record.aiTechnology),
    field('商业收益', COLOR.blue, record.businessBenefit),
    { spaceBeforePt: 4, runs: [{ text: `来源：${record.source.trim() || '无公开数值来源（定性描述）'}`, sizePt: BODY_FONT_PT, color: COLOR.muted }] },
  ]
}

// Latin characters are narrower than CJK ones; 0.6em is a deliberately generous average for Segoe UI.
const charEm = (ch: string) => (/[\u0000-ɏ]/u.test(ch) ? 0.6 : 1)

/** 保守估算文本在给定宽度下排版后的高度（磅），用于确认卡片内容不溢出。 */
export function estimateTextHeightPt(paragraphs: Paragraph[], widthPt: number): number {
  const usable = widthPt * 0.92
  let height = 0
  for (const p of paragraphs) {
    const lineWidth = p.runs.reduce((sum, r) => sum + [...r.text].reduce((w, ch) => w + charEm(ch), 0) * r.sizePt, 0)
    const lines = Math.max(1, Math.ceil(lineWidth / usable))
    const lineHeight = Math.max(...p.runs.map((r) => r.sizePt)) * 1.2
    height += p.spaceBeforePt + lines * lineHeight
  }
  return height
}

// ---- DrawingML / PresentationML 片段 ----

const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
const NS = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"'
const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/'
const FONT = '<a:latin typeface="Segoe UI"/><a:ea typeface="Microsoft YaHei"/><a:cs typeface="Segoe UI"/>'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const rgb = (hex: string, alphaPct?: number) => `<a:srgbClr val="${hex}">${alphaPct === undefined ? '' : `<a:alpha val="${Math.round(alphaPct * 1000)}"/>`}</a:srgbClr>`
const solid = (hex: string, alphaPct?: number) => `<a:solidFill>${rgb(hex, alphaPct)}</a:solidFill>`
const stops = (list: [number, string, number?][]) => `<a:gsLst>${list.map(([pos, hex, alpha]) => `<a:gs pos="${pos * 1000}">${rgb(hex, alpha)}</a:gs>`).join('')}</a:gsLst>`
const linear = (list: [number, string, number?][], angleDeg: number) => `<a:gradFill rotWithShape="1">${stops(list)}<a:lin ang="${angleDeg * 60000}" scaled="0"/></a:gradFill>`
const radial = (list: [number, string, number?][]) => `<a:gradFill rotWithShape="1">${stops(list)}<a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path></a:gradFill>`
const geom = (prst: string, adj?: number) => `<a:prstGeom prst="${prst}"><a:avLst>${adj === undefined ? '' : `<a:gd name="adj" fmla="val ${adj}"/>`}</a:avLst></a:prstGeom>`
const NO_LINE = '<a:ln><a:noFill/></a:ln>'
const xfrm = (b: Box) => `<a:xfrm><a:off x="${Math.round(b.x)}" y="${Math.round(b.y)}"/><a:ext cx="${Math.round(b.cx)}" cy="${Math.round(b.cy)}"/></a:xfrm>`

const run = (r: Run) => `<a:r><a:rPr lang="zh-CN" altLang="en-US" sz="${r.sizePt * 100}"${r.bold ? ' b="1"' : ''} dirty="0"><a:solidFill>${rgb(r.color)}</a:solidFill>${FONT}</a:rPr><a:t>${esc(r.text)}</a:t></a:r>`
const paragraph = (p: Paragraph) => `<a:p><a:pPr><a:spcBef><a:spcPts val="${p.spaceBeforePt * 100}"/></a:spcBef><a:buNone/></a:pPr>${p.runs.map(run).join('')}</a:p>`
const textBody = (paragraphs: Paragraph[], inset: { l: number; t: number; r: number; b: number }) =>
  `<p:txBody><a:bodyPr wrap="square" lIns="${Math.round(inset.l)}" tIns="${Math.round(inset.t)}" rIns="${Math.round(inset.r)}" bIns="${Math.round(inset.b)}" anchor="t" rtlCol="0"><a:noAutofit/></a:bodyPr><a:lstStyle/>${paragraphs.map(paragraph).join('')}</p:txBody>`

/** 生成单页幻灯片 XML：深色渐变背景 + 网格线 + 光晕 + 5×2 银行卡片。 */
export function renderSlideXml(records: BankAiRecord[] = bankAiRecords): string {
  if (records.length !== COLUMNS * ROWS) throw new Error(`the slide layout holds exactly ${COLUMNS * ROWS} banks, got ${records.length}`)
  let id = 1
  const shapes: string[] = []
  const sp = (name: string, box: Box, props: string, body = '') => {
    id += 1
    shapes.push(`<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${esc(name)}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>${xfrm(box)}${props}</p:spPr>${body}</p:sp>`)
  }
  const line = (box: Box, alphaPct: number) => {
    id += 1
    shapes.push(`<p:cxnSp><p:nvCxnSpPr><p:cNvPr id="${id}" name="Grid ${id}"/><p:cNvCxnSpPr/><p:nvPr/></p:nvCxnSpPr><p:spPr>${xfrm(box)}${geom('line')}<a:ln w="6350">${solid(COLOR.grid, alphaPct)}</a:ln></p:spPr></p:cxnSp>`)
  }

  const step = 0.5 * IN
  for (let x = step; x < SLIDE.cx; x += step) line({ x, y: 0, cx: 0, cy: SLIDE.cy }, 8)
  for (let y = step; y < SLIDE.cy; y += step) line({ x: 0, y, cx: SLIDE.cx, cy: 0 }, 8)

  sp('Glow Top Right', { x: SLIDE.cx - 3.4 * IN, y: 0, cx: 3.4 * IN, cy: 2.4 * IN }, `${geom('ellipse')}${radial([[0, COLOR.purple, 35], [100, COLOR.purple, 0]])}${NO_LINE}`)
  sp('Glow Bottom Left', { x: 0, y: SLIDE.cy - 2.2 * IN, cx: 3.2 * IN, cy: 2.2 * IN }, `${geom('ellipse')}${radial([[0, COLOR.cyan, 25], [100, COLOR.cyan, 0]])}${NO_LINE}`)

  sp('Title', { x: MARGIN, y: 0.16 * IN, cx: SLIDE.cx - 2 * MARGIN, cy: 0.66 * IN }, `${geom('rect')}<a:noFill/>${NO_LINE}`, textBody([
    {
      spaceBeforePt: 0,
      runs: [
        { text: DECK_TITLE, sizePt: 24, color: COLOR.white, bold: true },
        { text: '   GLOBAL TOP 10 BANKS · AI IN ACTION', sizePt: 12, color: COLOR.cyan, bold: true },
      ],
    },
    { spaceBeforePt: 2, runs: [{ text: '业务领域 × AI 技术 × 商业收益｜含数值的收益均附公开来源，其余为定性描述', sizePt: BODY_FONT_PT, color: COLOR.muted }] },
  ], { l: 0, t: 0, r: 0, b: 0 }))
  sp('Title Accent', { x: MARGIN, y: 0.88 * IN, cx: 2.6 * IN, cy: 0.035 * IN }, `${geom('rect')}${linear([[0, COLOR.cyan], [100, COLOR.purple]], 0)}${NO_LINE}`)

  records.forEach((record, index) => {
    const box = cardBox(index)
    sp(`Card ${index + 1} ${record.bankEn}`, box,
      `${geom('roundRect', 5000)}${solid(COLOR.card, 82)}<a:ln w="9525">${solid(COLOR.cardLine, 70)}</a:ln><a:effectLst><a:glow rad="38100">${rgb(COLOR.cardLine, 30)}</a:glow></a:effectLst>`,
      textBody(cardParagraphs(record, index), CARD_INSET))
    sp(`Card ${index + 1} Accent`, { x: box.x + CARD_INSET.l, y: box.y + 0.05 * IN, cx: 0.6 * IN, cy: 0.03 * IN }, `${geom('rect')}${linear([[0, COLOR.cyan], [100, COLOR.purple]], 0)}${NO_LINE}`)
  })

  sp('Footer', { x: MARGIN, y: FOOTER_TOP, cx: SLIDE.cx - 2 * MARGIN, cy: 0.28 * IN }, `${geom('rect')}<a:noFill/>${NO_LINE}`, textBody([
    { spaceBeforePt: 0, runs: [{ text: '银行范围参考 The Banker「Top 1000 World Banks」一级资本排名前列银行，序号不代表排名｜本页未使用银行 Logo 或第三方图片｜仅供展示，不构成投资建议', sizePt: BODY_FONT_PT, color: COLOR.muted }] },
  ], { l: 0, t: 0, r: 0, b: 0 }))

  const background = `<p:bg><p:bgPr>${linear([[0, COLOR.bgStart], [55, COLOR.bgMid], [100, COLOR.bgEnd]], 45)}<a:effectLst/></p:bgPr></p:bg>`
  const groupProps = '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
  return `${XML}<p:sld ${NS}><p:cSld>${background}<p:spTree>${groupProps}${shapes.join('')}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`
}

// ---- 包结构 ----

const rels = (items: [string, string, string][]) =>
  `${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${items.map(([rid, type, target]) => `<Relationship Id="${rid}" Type="${type.startsWith('http') ? type : REL + type}" Target="${target}"/>`).join('')}</Relationships>`

const EMPTY_TREE = '<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree>'

const themeFonts = '<a:latin typeface="Segoe UI"/><a:ea typeface="Microsoft YaHei"/><a:cs typeface=""/>'
const THEME = `${XML}<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Tech"><a:themeElements>`
  + `<a:clrScheme name="Tech"><a:dk1>${rgb('000000')}</a:dk1><a:lt1>${rgb('FFFFFF')}</a:lt1><a:dk2>${rgb(COLOR.bgMid)}</a:dk2><a:lt2>${rgb(COLOR.text)}</a:lt2>`
  + `<a:accent1>${rgb(COLOR.cyan)}</a:accent1><a:accent2>${rgb(COLOR.violet)}</a:accent2><a:accent3>${rgb(COLOR.blue)}</a:accent3><a:accent4>${rgb(COLOR.purple)}</a:accent4><a:accent5>${rgb(COLOR.grid)}</a:accent5><a:accent6>${rgb(COLOR.muted)}</a:accent6>`
  + `<a:hlink>${rgb(COLOR.cyan)}</a:hlink><a:folHlink>${rgb(COLOR.violet)}</a:folHlink></a:clrScheme>`
  + `<a:fontScheme name="Tech"><a:majorFont>${themeFonts}</a:majorFont><a:minorFont>${themeFonts}</a:minorFont></a:fontScheme>`
  + '<a:fmtScheme name="Tech">'
  + `<a:fillStyleLst>${'<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'.repeat(3)}</a:fillStyleLst>`
  + `<a:lnStyleLst>${'<a:ln w="6350"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>'.repeat(3)}</a:lnStyleLst>`
  + `<a:effectStyleLst>${'<a:effectStyle><a:effectLst/></a:effectStyle>'.repeat(3)}</a:effectStyleLst>`
  + `<a:bgFillStyleLst>${'<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'.repeat(3)}</a:bgFillStyleLst>`
  + '</a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>'

const MASTER = `${XML}<p:sldMaster ${NS}><p:cSld>${EMPTY_TREE}</p:cSld>`
  + '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>'
  + '<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>'

const LAYOUT = `${XML}<p:sldLayout ${NS} type="blank" preserve="1"><p:cSld name="Blank">${EMPTY_TREE}</p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`

const PRESENTATION = `${XML}<p:presentation ${NS} saveSubsetFonts="1">`
  + '<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>'
  + '<p:sldIdLst><p:sldId id="256" r:id="rId2"/></p:sldIdLst>'
  + `<p:sldSz cx="${SLIDE.cx}" cy="${SLIDE.cy}"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`

const PML = 'application/vnd.openxmlformats-officedocument.presentationml.'
const CONTENT_TYPES = `${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
  + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'
  + ([
    ['/ppt/presentation.xml', `${PML}presentation.main+xml`],
    ['/ppt/slideMasters/slideMaster1.xml', `${PML}slideMaster+xml`],
    ['/ppt/slideLayouts/slideLayout1.xml', `${PML}slideLayout+xml`],
    ['/ppt/slides/slide1.xml', `${PML}slide+xml`],
    ['/ppt/presProps.xml', `${PML}presProps+xml`],
    ['/ppt/viewProps.xml', `${PML}viewProps+xml`],
    ['/ppt/tableStyles.xml', `${PML}tableStyles+xml`],
    ['/ppt/theme/theme1.xml', 'application/vnd.openxmlformats-officedocument.theme+xml'],
    ['/docProps/core.xml', 'application/vnd.openxmlformats-package.core-properties+xml'],
    ['/docProps/app.xml', 'application/vnd.openxmlformats-officedocument.extended-properties+xml'],
  ] as const).map(([part, type]) => `<Override PartName="${part}" ContentType="${type}"/>`).join('')
  + '</Types>'

/** 生成只含 1 页幻灯片的 .pptx 文件内容；不访问网络，输出可复现。 */
export function buildPptx(records: BankAiRecord[] = bankAiRecords): Uint8Array {
  return createZip([
    { name: '[Content_Types].xml', data: CONTENT_TYPES },
    { name: '_rels/.rels', data: rels([
      ['rId1', 'officeDocument', 'ppt/presentation.xml'],
      ['rId2', 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties', 'docProps/core.xml'],
      ['rId3', 'extended-properties', 'docProps/app.xml'],
    ]) },
    { name: 'docProps/core.xml', data: `${XML}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${esc(DECK_TITLE)}</dc:title><dc:creator>banking-kyc</dc:creator></cp:coreProperties>` },
    { name: 'docProps/app.xml', data: `${XML}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>banking-kyc</Application><Slides>1</Slides></Properties>` },
    { name: 'ppt/presentation.xml', data: PRESENTATION },
    { name: 'ppt/_rels/presentation.xml.rels', data: rels([
      ['rId1', 'slideMaster', 'slideMasters/slideMaster1.xml'],
      ['rId2', 'slide', 'slides/slide1.xml'],
      ['rId3', 'theme', 'theme/theme1.xml'],
      ['rId4', 'presProps', 'presProps.xml'],
      ['rId5', 'viewProps', 'viewProps.xml'],
      ['rId6', 'tableStyles', 'tableStyles.xml'],
    ]) },
    { name: 'ppt/presProps.xml', data: `${XML}<p:presentationPr ${NS}/>` },
    { name: 'ppt/viewProps.xml', data: `${XML}<p:viewPr ${NS}><p:gridSpacing cx="76200" cy="76200"/></p:viewPr>` },
    { name: 'ppt/tableStyles.xml', data: `${XML}<a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>` },
    { name: 'ppt/theme/theme1.xml', data: THEME },
    { name: 'ppt/slideMasters/slideMaster1.xml', data: MASTER },
    { name: 'ppt/slideMasters/_rels/slideMaster1.xml.rels', data: rels([
      ['rId1', 'slideLayout', '../slideLayouts/slideLayout1.xml'],
      ['rId2', 'theme', '../theme/theme1.xml'],
    ]) },
    { name: 'ppt/slideLayouts/slideLayout1.xml', data: LAYOUT },
    { name: 'ppt/slideLayouts/_rels/slideLayout1.xml.rels', data: rels([['rId1', 'slideMaster', '../slideMasters/slideMaster1.xml']]) },
    { name: 'ppt/slides/slide1.xml', data: renderSlideXml(records) },
    { name: 'ppt/slides/_rels/slide1.xml.rels', data: rels([['rId1', 'slideLayout', '../slideLayouts/slideLayout1.xml']]) },
  ])
}
