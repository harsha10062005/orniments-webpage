import { getPublicPhoneLabel } from '../../utils/whatsapp'

export default function Footer() {
  const publicPhone = getPublicPhoneLabel()

  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 py-10 grid gap-10 grid-cols-1 md:grid-cols-3 text-center md:text-left">
        <div className="space-y-3">
          <h3 className="font-semibold text-white/90 text-lg">Luxury Gold Jewelry</h3>
          <p className="text-sm text-white/60 max-w-sm mx-auto md:mx-0">
            Premium designs, verified craftsmanship, and availability-first service.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-white/90 text-lg">Contact Us</h3>
          <div className="space-y-1">
            <p className="text-sm text-white/60">
              Phone: {publicPhone || 'Set VITE_PUBLIC_PHONE'}
            </p>
            <p className="text-sm text-white/60">
              WhatsApp: {publicPhone || 'Set VITE_WHATSAPP_NUMBER'}
            </p>
            <p className="text-sm text-white/60 truncate">
              Email: lakshmijeweley@gmail.com
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-white/90 text-lg">Our Location</h3>
          <p className="text-sm text-white/60">Showroom Address, India</p>
          <p className="mt-4 text-xs text-white/30 uppercase tracking-widest">© {new Date().getFullYear()} Dhana Lakshmi Jewelery</p>
        </div>
      </div>
    </footer>
  )
}

