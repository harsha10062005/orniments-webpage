import { motion, type Variants } from 'framer-motion'
import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Product } from '../types/api'
import { productPrimaryImage } from '../types/api'
import { Link } from 'react-router-dom'
import { buildWhatsappHref } from '../utils/whatsapp'
import { ShieldCheck, Award, Truck, MessageCircle, ChevronRight } from 'lucide-react'

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const cardItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15 
    } 
  }
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  }
}

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [instaLinks, setInstaLinks] = useState<any[]>([])
  const [enquiring, setEnquiring] = useState<string | null>(null)

  async function handleEnquire(product: Product) {
    try {
      setEnquiring(product._id)
      await api.post('/enquiries', {
        customerName: 'Customer (via Home Page)',
        phoneNumber: '-',
        productName: product.productName,
        message: `Inquiry for ${product.productName} (₹${product.discountPrice || product.price})`
      })

      const productLink = `${window.location.origin}/products/${product._id}`
      const imageUrl = productPrimaryImage(product)
      const specs = product.specifications?.map(s => `${s.label}: ${s.value}`).join('\n') || ''

      const message = [
        'Hi, I would like to enquire about this product:',
        '',
        `Product: ${product.productName}`,
        `Price: ₹${product.discountPrice || product.price}`,
        `Availability: ${product.availabilityStatus.replace('_', ' ')}`,
        product.description ? `\nDescription: ${product.description}` : '',
        specs ? `\nSpecifications:\n${specs}` : '',
        '',
        `Image: ${imageUrl}`,
        `Link: ${productLink}`,
        '',
        'Could you provide more details and let me know if it is available?',
      ].filter(Boolean).join('\n')

      const wa = buildWhatsappHref(message)
      if (wa) {
        window.open(wa, '_blank', 'noopener,noreferrer')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setEnquiring(null)
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const [prodRes, bannerRes, instaRes] = await Promise.all([
          api.get<{ items: Product[] }>('/products', { params: { featured: true, limit: 4 } }),
          api.get('/banners'),
          api.get('/instagram')
        ])
        setFeatured(prodRes.data.items || [])
        setBanners(bannerRes.data.items || [])
        setInstaLinks(instaRes.data.items || [])
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 pb-20 space-y-28 overflow-hidden">
      {/* Hero / Banners */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0c0b10] mt-6">
        {banners.length > 0 ? (
          <div className="relative aspect-[4/5] sm:aspect-[21/9] lg:aspect-[21/7]">
            <img 
              src={banners[0].imageUrl} 
              className="w-full h-full object-cover opacity-50 transition-all duration-1000 scale-100 hover:scale-105" 
              alt="Banner" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a0f] via-black/40 to-black/10" />
            <div className="absolute inset-0 flex items-center p-8 sm:p-16">
              <motion.div initial="hidden" animate="show" variants={fadeInUp} className="max-w-3xl">
                <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-200/10 border border-yellow-200/20 text-yellow-200 text-[10px] tracking-[0.3em] font-bold uppercase mb-6">
                  NEW ARRIVALS
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif leading-tight text-white mb-8 tracking-wide">
                  {banners[0].title || 'Exquisite 1 Gram Gold Jewelry'}
                </h1>
                <Link to="/shop" className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 bg-gold-gradient text-black font-bold hover:opacity-90 hover:scale-105 active:scale-95 transition-all gold-glow duration-300">
                  Shop Collection
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="p-8 sm:p-16 lg:p-20 relative">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_10%,rgba(250,204,21,0.15),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_35%)]" />
            <div className="relative z-10 grid gap-12 lg:grid-cols-12 items-center">
              <motion.div 
                initial="hidden" 
                animate="show" 
                variants={fadeInUp} 
                className="lg:col-span-7 space-y-8"
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-200/10 border border-yellow-200/25 text-yellow-200 text-[10px] tracking-[0.3em] font-bold uppercase">
                  EXCLUSIVE SHOWROOM
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-light leading-[1.1] tracking-wide text-white">
                  1 Gram Gold <br />
                  <span className="text-yellow-200 font-light italic font-serif">Redefined.</span>
                </h1>
                <p className="text-white/60 text-base sm:text-lg max-w-lg leading-relaxed font-light">
                  Experience the stunning brilliance of pure gold in masterpieces engineered to last. Handcrafted excellence, delivered with complete trust.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/shop" className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 bg-gold-gradient text-black font-bold hover:scale-105 active:scale-95 transition-all gold-glow duration-300">
                    Explore Collections
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 relative aspect-square"
              >
                <div className="absolute -inset-1.5 rounded-[2.5rem] bg-gradient-to-tr from-yellow-200/20 to-purple-500/10 blur opacity-40" />
                <img 
                  src="https://placehold.co/800x800/16141a/fef08a?text=Premium+Collection" 
                  className="relative z-10 w-full h-full object-cover rounded-[2.5rem] border border-white/10" 
                  alt="Hero Showcase" 
                  loading="lazy" 
                />
              </motion.div>
            </div>
          </div>
        )}
      </section>

      {/* Trust Badges */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
      >
        {[
          { icon: ShieldCheck, title: 'Certified Quality', desc: 'Purity guaranteed' },
          { icon: Award, title: 'Unique Designs', desc: 'Handcrafted excellence' },
          { icon: Truck, title: 'Safe Delivery', desc: 'Secure & Insured' },
          { icon: MessageCircle, title: 'Quick Support', desc: '24/7 WhatsApp' },
        ].map((item) => (
          <motion.div 
            key={item.title} 
            variants={cardItem}
            className="text-center p-8 rounded-3xl glass-panel glass-panel-hover"
          >
            <div className="w-12 h-12 rounded-2xl bg-yellow-200/10 border border-yellow-200/20 flex items-center justify-center mx-auto mb-5 transition-transform duration-300 hover:rotate-6">
              <item.icon className="w-6 h-6 text-yellow-200" />
            </div>
            <h3 className="font-medium text-white text-base">{item.title}</h3>
            <p className="text-[10px] text-white/45 mt-2 uppercase tracking-widest font-semibold">{item.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Featured Products */}
      <section className="space-y-10">
        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div>
            <span className="text-[10px] uppercase text-yellow-200/80 tracking-[0.3em] font-bold">CLIENT FAVORITES</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white mt-2">Featured Collections</h2>
          </div>
          <Link to="/shop" className="text-yellow-200 hover:text-yellow-100 font-medium flex items-center gap-1 group transition-colors">
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {featured.map((p) => (
            <motion.div 
              key={p._id} 
              variants={cardItem}
              whileHover={{ y: -6 }}
              className="group rounded-3xl glass-panel p-3 flex flex-col justify-between transition-all duration-300 border border-white/5 hover:border-yellow-200/20"
            >
              <div>
                <Link to={`/products/${p._id}`}>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black/40 border border-white/5 mb-4">
                    <img 
                      src={productPrimaryImage(p)} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      alt={p.productName} 
                      loading="lazy" 
                    />
                  </div>
                  <div className="px-1">
                    <h3 className="font-medium text-sm text-white/90 line-clamp-1 group-hover:text-yellow-200 transition-colors duration-300">
                      {p.productName}
                    </h3>
                    <p className="text-yellow-200 font-semibold mt-1">₹{p.discountPrice || p.price}</p>
                  </div>
                </Link>
              </div>
              <div className="px-1 pt-4">
                <button
                  onClick={() => handleEnquire(p)}
                  disabled={enquiring === p._id}
                  className="w-full rounded-xl bg-yellow-200/10 text-yellow-200 border border-yellow-200/20 font-medium px-4 py-2.5 hover:bg-yellow-200 hover:text-black transition-all flex items-center justify-center gap-2 text-xs select-none active:scale-95 duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Enquiry
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Instagram Preview */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-[2.5rem] glass-panel p-8 sm:p-16 text-center space-y-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.15),transparent_60%)]" />
        <div className="relative z-10 space-y-6">
          <InstagramIcon className="w-12 h-12 text-yellow-200 mx-auto opacity-70 animate-pulse" />
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif text-white">Join us on Instagram</h2>
            <p className="text-white/50 max-w-md mx-auto text-sm sm:text-base font-light leading-relaxed">
              Get daily updates on new arrivals, behind-the-scenes designs, and exclusive showcases.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex justify-center gap-4 flex-wrap pt-4">
            {instaLinks.slice(0, 4).map((link, i) => (
              <a 
                key={link._id || i} 
                href={link.url} 
                target="_blank" 
                rel="noreferrer"
                className="aspect-square w-full sm:w-24 h-auto sm:h-24 rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-200/50 transition-all hover:scale-105 bg-white/5 flex items-center justify-center group"
              >
                <div className="w-full h-full flex items-center justify-center transition-colors group-hover:bg-yellow-200/5">
                  <InstagramIcon className="w-6 h-6 text-white/30 group-hover:text-yellow-200/60 transition-colors" />
                </div>
              </a>
            ))}
          </div>
          <div className="pt-6">
            <a 
              href="https://www.instagram.com/dhanalakshmi_jewelery/" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-yellow-200 hover:scale-105 active:scale-95 transition-all gold-glow duration-300"
            >
              Follow @dhanalakshmi_jewelery
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

