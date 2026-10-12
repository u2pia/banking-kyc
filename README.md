# banking-kyc

Banking KYC service. Changes land through the Aperture control plane: an approved Intent, an agent run, evidence, and a named reviewer before merge.

## KYC 参考流程生成

- 入口：`src/kycFlow.ts` 的 `generateKycFlow({ audience: 'developer', format: 'compact' })`
- 输出一份精简的开发参考流程（title、disclaimer、steps、fields、states、examples），内容静态、确定性，不采集、不存储、不传输任何用户个人数据，不发起网络请求
- 非法入参返回错误码 `KYC_FLOW_INVALID_INPUT` 与 `missingFields`
- 输出仅供参考，不构成合规结论或法律意见；示例数据均为虚构占位符
- 测试：`test/kycFlow.test.ts`


## 全球市值前五大银行 KYC AI 应用报告

- 入口：`src/topFiveBankKycAi.ts` 的 `generateTopFiveBankKycAiReport()`，返回一份 Markdown 文本
- 内容：标题 + 免责声明 + 市值排名口径（含数据时点 `asOf` 与来源 `source`）+ 5 个银行二级标题章节，每章列出 ≥2 个 KYC 场景 AI 应用点 + 小结
- 静态、确定性输出：不接入实时行情、不抓取外部网页、不发起网络请求、不接入银行内部系统
- 不处理、不存储、不输出真实个人身份信息或客户 KYC 数据；输出不构成监管批准、法律意见或正式合规结论
- 缺少排名时点 / 来源 / 口径说明，或银行条目数量与内容不满足约束时，返回错误码
  `TOP_FIVE_BANK_KYC_AI_INVALID_RANKING_BASIS` 与 `missingFields`，而不是输出排名结果
- 测试：`test/topFiveBankKycAi.test.ts`


## 全球十大银行 AI 应用分析

- 演示文稿：`docs/global-top10-bank-ai.md`（Marp 格式，一家银行一页，每页包含业务场景、技术架构、商业收益；可用 Marp 导出为 PPTX / PDF）
- 案例数据：`src/bankAiCases.ts`，修改数据后需同步更新演示文稿，`test/bankAiCases.test.ts` 会校验二者一致
