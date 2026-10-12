# banking-kyc

Banking KYC service. Changes land through the Aperture control plane: an approved Intent, an agent run, evidence, and a named reviewer before merge.

## KYC 参考流程生成

- 入口：`src/kycFlow.ts` 的 `generateKycFlow({ audience: 'developer', format: 'compact' })`
- 输出一份精简的开发参考流程（title、disclaimer、steps、fields、states、examples），内容静态、确定性，不采集、不存储、不传输任何用户个人数据，不发起网络请求
- 非法入参返回错误码 `KYC_FLOW_INVALID_INPUT` 与 `missingFields`
- 输出仅供参考，不构成合规结论或法律意见；示例数据均为虚构占位符
- 测试：`test/kycFlow.test.ts`


## 全球十大银行 AI 应用分析

- 演示文稿：`docs/global-top10-bank-ai.md`（Marp 格式，一家银行一页，每页包含业务场景、技术架构、商业收益；可用 Marp 导出为 PPTX / PDF）
- 案例数据：`src/bankAiCases.ts`，修改数据后需同步更新演示文稿，`test/bankAiCases.test.ts` 会校验二者一致
