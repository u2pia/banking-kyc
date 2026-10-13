export type KycStatus = 'pending' | 'verified' | 'rejected'

export type Customer = {
  id: string
  fullName: string
  dateOfBirth: string
  documentNumber?: string
  status: KycStatus
}

/** Starts a KYC case for a customer; verification rules are added through approved Intents. */
export function openCase(input: { id: string; fullName: string; dateOfBirth: string; documentNumber?: string }): Customer {
  if (!input.id.trim()) throw new Error('id is required')
  if (!input.fullName.trim()) throw new Error('fullName is required')
  return { ...input, fullName: input.fullName.trim(), status: 'pending' }
}

/**
 * Exports an existing KYC summary as Markdown text.
 *
 * The rendering is pure and deterministic: it only formats the fields already
 * present on the summary (values are never altered) and performs no file
 * system writes, network requests or external service calls.
 */
export function exportKycReportMarkdown(customer: Customer): string {
  const lines: string[] = [
    '# KYC Report',
    '',
    `## Customer ${customer.id}`,
    '',
    '| Field | Value |',
    '| --- | --- |',
    `| ID | ${customer.id} |`,
    `| Full name | ${customer.fullName} |`,
    `| Date of birth | ${customer.dateOfBirth} |`,
    `| Document number | ${customer.documentNumber ?? '—'} |`,
    `| Status | ${customer.status} |`,
    '',
    '> Disclaimer: this report is a deterministic rendering of an existing KYC summary. It is for reference only and does not constitute a compliance conclusion or legal opinion.',
    ''
  ]
  return lines.join('\n')
}
