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
 * Neutralises Markdown table structure characters inside a cell value so the
 * table keeps exactly one row per record regardless of the field content:
 *
 * - `|` is escaped as `\|` so it cannot open or close a column
 * - line breaks (`\r\n`, `\n`, `\r`) are collapsed to a single space so they
 *   cannot add rows
 *
 * Values without those characters are returned unchanged, and no HTML
 * escaping is performed (that is the renderer's concern, not the exporter's).
 */
function toTableCell(value: string): string {
  return value.replace(/\r\n|[\r\n]+/g, ' ').replace(/\|/g, '\\|')
}

/**
 * Exports an existing KYC summary as Markdown text.
 *
 * The rendering is pure and deterministic: it only formats the fields already
 * present on the summary and performs no file system writes, network requests
 * or external service calls. Field values are structurally neutralised for the
 * Markdown table (see {@link toTableCell}) so pipes and line breaks inside
 * values cannot alter the table shape; values without such characters are
 * rendered byte-for-byte as-is.
 */
export function exportKycReportMarkdown(customer: Customer): string {
  const lines: string[] = [
    '# KYC Report',
    '',
    `## Customer ${customer.id}`,
    '',
    '| Field | Value |',
    '| --- | --- |',
    `| ID | ${toTableCell(customer.id)} |`,
    `| Full name | ${toTableCell(customer.fullName)} |`,
    `| Date of birth | ${toTableCell(customer.dateOfBirth)} |`,
    `| Document number | ${toTableCell(customer.documentNumber ?? '—')} |`,
    `| Status | ${toTableCell(customer.status)} |`,
    '',
    '> Disclaimer: this report is a deterministic rendering of an existing KYC summary. It is for reference only and does not constitute a compliance conclusion or legal opinion.',
    ''
  ]
  return lines.join('\n')
}
