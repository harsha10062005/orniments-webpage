import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#0b0a0f]/75 backdrop-blur-xl border-b border-white/5">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 py-4 flex items-center justify-between">
        <NavLink to="/" className="font-semibold tracking-wide text-white group flex items-center gap-2">
          <span className="text-white/90 font-serif text-lg sm:text-xl tracking-wide group-hover:text-white transition-colors">
            Dhana Lakshmi
          </span>
          <span className="text-yellow-200 font-serif text-lg sm:text-xl tracking-wide font-normal px-2 py-0.5 rounded bg-yellow-200/10 border border-yellow-200/20 group-hover:bg-yellow-200/20 transition-all">
            Jewelery
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {nav.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                `relative px-3 py-1.5 transition-colors duration-300 font-medium tracking-wide ${
                  isActive ? 'text-yellow-200' : 'text-white/70 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{i.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-yellow-200 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-full left-0 right-0 z-40 bg-[#0b0a0f]/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden md:hidden"
            >
              <nav className="flex flex-col p-6 gap-2">
                {nav.map((i) => (
                  <NavLink
                    key={i.to}
                    to={i.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `text-base font-medium py-3 px-4 rounded-xl transition-all ${
                        isActive 
                          ? 'text-yellow-200 bg-yellow-200/5 font-semibold' 
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {i.label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

