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
