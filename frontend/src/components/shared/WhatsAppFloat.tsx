import { useMemo } from 'react'
import { buildWhatsappHref } from '../../utils/whatsapp'

const whatsappBaseMessage = 'Hello, I am interested in this jewelry product.'

export default function WhatsAppFloat() {
  const href = useMemo(
    () => buildWhatsappHref(whatsappBaseMessage),
    [],
  )

  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-4 z-[60] rounded-full bg-yellow-200 text-black shadow-lg shadow-black/30 w-14 h-14 flex items-center justify-center hover:scale-[1.03] transition-transform"
    >
      <span className="text-xl leading-none">WA</span>
    </a>
  )
}

