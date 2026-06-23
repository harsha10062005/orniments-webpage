import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import api from '../services/api'
import { ChevronLeft, ChevronRight, Loader2, Award, Clock, MapPin } from 'lucide-react'

export default function About() {
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await api.get('/page-photos/about')
        setPhotos(res.data.items || [])
      } catch (err) {
        console.error('Failed to fetch about photos', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPhotos()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 pb-20 pt-10 space-y-16 overflow-hidden">
      <div>
        <span className="text-[10px] uppercase text-yellow-200/80 tracking-[0.3em] font-bold">OUR HERITAGE</span>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-3xl sm:text-4xl font-serif text-white tracking-wide mt-1"
        >
          About Us
        </motion.h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 items-center">
        {/* TEXT SECTION */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="rounded-3xl glass-panel p-8 sm:p-10 space-y-6"
        >
          <span className="text-[10px] tracking-[0.35em] text-yellow-200/90 font-bold uppercase">OUR STORY</span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white leading-snug">Luxury Showroom Experience</h2>
          <div className="text-white/60 text-sm sm:text-base font-light leading-relaxed space-y-5">
            <p>
              Welcome to our premium 1 Gram Gold Jewelry collection. We believe that 
              luxury and celebration-ready designs should be accessible to everyone who appreciates exceptional artistry.
            </p>
            <p>
              Every piece in our collection is carefully curated to ensure maximum 
              durability, premium finishing, and a look that is completely 
              indistinguishable from pure 24k gold.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 text-center">
            <div>
              <p className="text-2xl font-serif text-yellow-200">100%</p>
              <p className="text-[9px] text-white/40 uppercase tracking-wider font-semibold mt-1">Certified Gold</p>
            </div>
            <div>
              <p className="text-2xl font-serif text-yellow-200">5000+</p>
              <p className="text-[9px] text-white/40 uppercase tracking-wider font-semibold mt-1">Happy Clients</p>
            </div>
            <div>
              <p className="text-2xl font-serif text-yellow-200">10+</p>
              <p className="text-[9px] text-white/40 uppercase tracking-wider font-semibold mt-1">Years of Trust</p>
            </div>
          </div>
        </motion.div>

        {/* IMAGE SECTION / CAROUSEL */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden border border-white/5 bg-black/40 shadow-2xl"
        >
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-200" />
              <p className="mt-4 text-white/45 text-xs tracking-wider uppercase font-medium">Loading showroom...</p>
            </div>
          ) : photos.length > 0 ? (
            <div className="relative w-full h-full group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={photos[currentIndex]._id}
                  src={photos[currentIndex].imageUrl}
                  alt="Showroom"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {photos.length > 1 && (
                <>
                  <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0b0a0f]/60 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-yellow-200 hover:text-black"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0b0a0f]/60 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-yellow-200 hover:text-black"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {photos.map((_, i) => (
                      <div 
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-yellow-200 w-4' : 'bg-white/30'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-full relative group">
              <img 
                src="https://placehold.co/800x800/16141a/fef08a?text=Our+Showroom" 
                alt="Our Showroom"
                className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 right-8 space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-yellow-200/10 border border-yellow-200/25 text-yellow-200 text-[8px] uppercase tracking-widest font-bold">PHYSICAL STORE</span>
                <h3 className="text-xl font-serif text-white">Visit our physical showroom</h3>
                <p className="text-white/50 text-xs font-light">Experience the exquisite details, craftsmanship, and pure weight in person.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Showroom details cards */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6"
      >
        <div className="flex gap-4 p-6 rounded-3xl glass-panel hover:border-yellow-200/20 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-yellow-200/10 border border-yellow-200/20 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-yellow-200" />
          </div>
          <div>
            <h4 className="font-serif text-white font-medium">Showroom Location</h4>
            <p className="text-xs text-white/50 mt-1 leading-relaxed font-light">Explore physical collections inside our premium gold showroom.</p>
          </div>
        </div>
        <div className="flex gap-4 p-6 rounded-3xl glass-panel hover:border-yellow-200/20 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-yellow-200/10 border border-yellow-200/20 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-yellow-200" />
          </div>
          <div>
            <h4 className="font-serif text-white font-medium">Business Hours</h4>
            <p className="text-xs text-white/50 mt-1 leading-relaxed font-light">Mon - Sat: 10:00 AM - 8:30 PM <br />Sunday: Closed</p>
          </div>
        </div>
        <div className="flex gap-4 p-6 rounded-3xl glass-panel hover:border-yellow-200/20 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-yellow-200/10 border border-yellow-200/20 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-yellow-200" />
          </div>
          <div>
            <h4 className="font-serif text-white font-medium">Gold Standard Purity</h4>
            <p className="text-xs text-white/50 mt-1 leading-relaxed font-light">Engineered coatings designed for extreme durability and standard wear resistance.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

