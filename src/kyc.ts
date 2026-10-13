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
 * Renders a single field value as a Markdown table cell.
 *
 * Only characters that would break the table structure are neutralised:
 * unescaped pipes are escaped as `\|` and line breaks are collapsed to the
 * literal two-character sequence `\n` so a record always stays on one line.
 * Values that contain neither are returned byte-for-byte unchanged, and no
 * HTML escaping is performed (that is the renderer's responsibility).
 */
function markdownCell(value: string): string {
  return value
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/(?<!\\)\|/g, '\\|')
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
    `| ID | ${markdownCell(customer.id)} |`,
    `| Full name | ${markdownCell(customer.fullName)} |`,
    `| Date of birth | ${markdownCell(customer.dateOfBirth)} |`,
    `| Document number | ${markdownCell(customer.documentNumber ?? '—')} |`,
    `| Status | ${markdownCell(customer.status)} |`,
    '',
    '> Disclaimer: this report is a deterministic rendering of an existing KYC summary. It is for reference only and does not constitute a compliance conclusion or legal opinion.',
    ''
  ]
  return lines.join('\n')
}
