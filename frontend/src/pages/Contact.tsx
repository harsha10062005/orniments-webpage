import { useState, type FormEvent } from 'react'
import api from '../services/api'
import { buildWhatsappHref, getPublicPhoneLabel } from '../utils/whatsapp'
import { Loader2, Send, MapPin, PhoneCall, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Contact() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const [loading, setLoading] = useState(false)
  const publicPhone = getPublicPhoneLabel()

  async function handleSendEnquiry(e: FormEvent) {
    e.preventDefault()
    if (!name || !phone) return alert('Please provide name and phone number')

    try {
      setLoading(true)
      await api.post('/enquiries', {
        customerName: name,
        phoneNumber: phone,
        message: message
      })

      const wa = buildWhatsappHref(
        [
          'Callback / enquiry from website',
          '',
          `Name: ${name.trim() || '—'}`,
          `Phone: ${phone.trim() || '—'}`,
          '',
          message.trim() || '(no message)',
        ].join('\n'),
      )

      if (wa) {
        window.open(wa, '_blank', 'noopener,noreferrer')
      } else {
        alert('Enquiry sent successfully! We will contact you soon.')
      }

      setName('')
      setPhone('')
      setMessage('')
    } catch (err) {
      console.error(err)
      alert('Failed to send enquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 pb-20 pt-6 space-y-10 overflow-hidden">
      <div>
        <span className="text-[10px] uppercase text-yellow-200/80 tracking-[0.3em] font-bold">CONNECT</span>
        <h1 className="text-3xl sm:text-4xl font-serif text-white mt-1">Contact Us</h1>
        <p className="mt-2 text-white/50 text-sm font-light">
          Send a quick enquiry and our customer specialists will help with pricing, custom sizes, and availability.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form
            onSubmit={handleSendEnquiry}
            className="rounded-[2rem] glass-panel p-8 sm:p-10 space-y-6 h-full"
          >
            <h2 className="text-xl sm:text-2xl font-serif text-white mb-2">Send an Enquiry</h2>
            <div className="grid gap-5">
              <label className="text-xs uppercase text-white/50 tracking-wider font-semibold">
                Customer Name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="mt-2.5 w-full rounded-2xl bg-white/[0.02] border border-white/5 px-4 py-3.5 text-white placeholder-white/20 outline-none focus:bg-white/[0.04] focus:border-yellow-200/40 focus:ring-1 focus:ring-yellow-200/10 transition-all duration-300"
                />
              </label>
              <label className="text-xs uppercase text-white/50 tracking-wider font-semibold">
                Phone Number
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your Phone Number"
                  className="mt-2.5 w-full rounded-2xl bg-white/[0.02] border border-white/5 px-4 py-3.5 text-white placeholder-white/20 outline-none focus:bg-white/[0.04] focus:border-yellow-200/40 focus:ring-1 focus:ring-yellow-200/10 transition-all duration-300"
                />
              </label>
              <label className="text-xs uppercase text-white/50 tracking-wider font-semibold">
                Message
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Let us know what you are looking for..."
                  className="mt-2.5 w-full min-h-[140px] rounded-2xl bg-white/[0.02] border border-white/5 px-4 py-3.5 text-white placeholder-white/20 outline-none focus:bg-white/[0.04] focus:border-yellow-200/40 focus:ring-1 focus:ring-yellow-200/10 transition-all duration-300 resize-none"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-2xl bg-gold-gradient text-black font-bold px-6 py-4 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 gold-glow duration-300 select-none text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Enquiry via WhatsApp
              </button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="rounded-[2rem] glass-panel p-8 sm:p-10 space-y-6">
            <h2 className="text-xl sm:text-2xl font-serif text-white">Visit our Showroom</h2>
            <p className="text-white/50 text-sm font-light">Experience luxury Gold Artistry in person at our customer lounge.</p>
            <div className="rounded-2xl border border-white/5 bg-black/40 h-[240px] flex flex-col items-center justify-center text-white/30 space-y-2 group relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.06),transparent_65%)]" />
              <MapPin className="w-8 h-8 text-yellow-200/40 animate-bounce relative z-10" />
              <span className="text-xs uppercase tracking-widest font-semibold text-white/40 relative z-10">Google Maps Live Lounge</span>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-200/10 flex items-center justify-center flex-shrink-0">
                  <PhoneCall className="w-4 h-4 text-yellow-200" />
                </div>
                <div>
                  <p className="text-[10px] text-white/45 uppercase tracking-wide">Phone & Support</p>
                  <p className="text-sm text-white font-medium">{publicPhone || '+91 99999-88888'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-200/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-yellow-200" />
                </div>
                <div>
                  <p className="text-[10px] text-white/45 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-white font-medium">support@dhanalakshmijewelry.com</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

