/** Digits only, country code included (e.g. India 919876543210). No + or spaces. */
export function getWhatsappDigits(): string {
  const raw = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || ''
  return raw.replace(/\D/g, '')
}

export function buildWhatsappHref(message: string): string | null {
  const digits = getWhatsappDigits()
  if (!digits) return null
  const text = encodeURIComponent(message.trim() || 'Hello.')
  return `https://wa.me/${digits}?text=${text}`
}

/** Optional human-readable phone for UI (e.g. +91 98765 43210). */
export function getPublicPhoneLabel(): string {
  const label = (import.meta.env.VITE_PUBLIC_PHONE as string | undefined)?.trim()
  if (label) return label
  const d = getWhatsappDigits()
  if (d.startsWith('91') && d.length >= 12) {
    const rest = d.slice(2)
    return `+91 ${rest.slice(0, 5)} ${rest.slice(5)}`.trim()
  }
  return d ? `+${d}` : ''
}
