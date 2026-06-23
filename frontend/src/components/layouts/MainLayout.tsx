import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../shared/Footer'
import WhatsAppFloat from '../shared/WhatsAppFloat'
import Header from '../shared/Header'

export default function MainLayout() {
  const location = useLocation()

  return (
    <div className="min-h-dvh bg-[#0b0a0f] text-white relative overflow-x-hidden">
      {/* Background Ambient Glowing Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(254,240,138,0.05)_0%,transparent_75%)] animate-float-slow" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(170,59,255,0.04)_0%,transparent_75%)] animate-float-medium" />
        <div className="absolute top-[35%] left-[25%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(254,240,138,0.02)_0%,transparent_75%)] animate-pulse-soft" />
      </div>

      <div className="relative z-10 flex flex-col min-h-dvh">
        <Header />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </div>
  )
}

