import { motion } from 'framer-motion'

export default function AdminDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { k: 'Products', v: '—' },
          { k: 'Enquiries', v: '—' },
          { k: 'Availability', v: '—' },
        ].map((card) => (
          <div key={card.k} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/60">{card.k}</div>
            <div className="mt-3 text-3xl font-semibold text-yellow-200">{card.v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Admin features</h2>
        <p className="mt-2 text-white/60 text-sm">
          Add products, manage categories, control visibility, update availability status,
          manage banners & Instagram links, and reply to customer enquiries.
        </p>
      </div>
    </motion.div>
  )
}

