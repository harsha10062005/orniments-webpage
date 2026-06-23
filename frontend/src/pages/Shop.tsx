import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Product } from '../types/api'
import { productPrimaryImage } from '../types/api'
import { buildWhatsappHref } from '../utils/whatsapp'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { Loader2, MessageCircle } from 'lucide-react'

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 16 
    } 
  }
}

export default function Shop() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<{ items: Product[] }>('/products', {
          params: { limit: 50 },
        })
        setItems(data.items || [])
      } catch (e) {
        console.error('Failed to load products', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleEnquire(product: Product) {
    try {
      await api.post('/enquiries', {
        customerName: 'Customer (via Shop Page)',
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
    }
  }

  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 pb-20 pt-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[10px] uppercase text-yellow-200/80 tracking-[0.3em] font-bold">DISCOVER</span>
          <h1 className="text-3xl sm:text-4xl font-serif text-white mt-1">Our Collection</h1>
          <p className="mt-2 text-white/50 text-sm font-light">
            Browse through our luxury jewelry designs and enquire instantly for customized pricing and availability.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-20 flex flex-col items-center justify-center min-h-[30vh]">
          <Loader2 className="w-10 h-10 animate-spin text-yellow-200" />
          <p className="mt-4 text-white/40 text-xs tracking-wider uppercase font-semibold">Fetching collections...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-white/5 bg-white/5 p-8 text-center max-w-lg mx-auto">
          <p className="text-white/60 text-sm">No products available at the moment. Please check back soon.</p>
        </div>
      ) : (
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mt-12 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {items.map((p) => {
            return (
              <motion.div
                key={p._id}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="group rounded-3xl glass-panel p-3 flex flex-col justify-between transition-all duration-300 border border-white/5 hover:border-yellow-200/20"
              >
                <div>
                  <Link to={`/products/${p._id}`} className="aspect-[4/5] bg-black/40 overflow-hidden block rounded-2xl border border-white/5 relative">
                    <img
                      src={productPrimaryImage(p)}
                      alt={p.productName}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#0b0a0f]/80 backdrop-blur-md border border-white/5 text-[9px] uppercase tracking-wider text-yellow-200 font-medium">
                        {p.availabilityStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </Link>
                  <div className="px-1 pt-4 space-y-2">
                    <Link to={`/products/${p._id}`}>
                      <h3 className="font-medium text-sm text-white/90 line-clamp-2 group-hover:text-yellow-200 transition-colors duration-300">
                        {p.productName}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      {p.discountPrice ? (
                        <>
                          <span className="text-yellow-200 font-semibold">₹{p.discountPrice}</span>
                          <span className="text-white/40 text-xs line-through">₹{p.price}</span>
                        </>
                      ) : (
                        <span className="text-yellow-200 font-semibold">₹{p.price}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-1 pt-4">
                  <button
                    onClick={() => handleEnquire(p)}
                    className="w-full rounded-xl bg-yellow-200/10 text-yellow-200 border border-yellow-200/20 font-medium px-4 py-2.5 hover:bg-yellow-200 hover:text-black transition-all flex items-center justify-center gap-2 text-xs select-none active:scale-95 duration-300"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Enquiry
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

