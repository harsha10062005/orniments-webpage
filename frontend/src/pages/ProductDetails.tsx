import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import type { Product } from '../types/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ChevronLeft, ChevronRight, Phone, MessageCircle, Info, ShieldCheck, ArrowLeft } from 'lucide-react'
import { buildWhatsappHref } from '../utils/whatsapp'

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImg, setCurrentImg] = useState(0)
  const [enquiring, setEnquiring] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const res = await api.get(`/products/${id}`)
        setProduct(res.data.product)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProduct()
  }, [id])

  const handleEnquire = async () => {
    if (!product) return
    try {
      setEnquiring(true)
      await api.post('/enquiries', {
        customerName: 'Customer (via Product Details)',
        phoneNumber: '-',
        productName: product.productName,
        message: `Inquiry for ${product.productName} (₹${product.discountPrice || product.price})`
      })

      const productLink = window.location.href
      const imageUrl = product.images.length > 0 ? product.images[0].url : ''
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
      if (wa) window.open(wa, '_blank')
    } catch (err) {
      console.error(err)
    } finally {
      setEnquiring(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 animate-spin text-yellow-200" />
      <p className="mt-4 text-white/40 text-xs tracking-wider uppercase font-semibold">Loading product details...</p>
    </div>
  )

  if (!product) return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 py-20 text-center space-y-6">
      <h2 className="text-2xl font-serif text-white">Product Not Found</h2>
      <Link to="/shop" className="inline-flex items-center gap-2 text-yellow-200 hover:text-yellow-100 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>
    </div>
  )

  const images = product.images.length > 0 ? product.images : [{ url: 'https://placehold.co/800x800/1a1a1a/fef08a?text=No+Image' }]

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 overflow-hidden">
      {/* Back Button */}
      <div className="mb-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-white/60 hover:text-yellow-200 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Gallery Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-black/40 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={images[currentImg].url}
                src={images[currentImg].url}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentImg((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0b0a0f]/60 text-white backdrop-blur-md border border-white/10 hover:bg-yellow-200 hover:text-black transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setCurrentImg((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0b0a0f]/60 text-white backdrop-blur-md border border-white/10 hover:bg-yellow-200 hover:text-black transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImg(i)}
                className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                  i === currentImg 
                    ? 'border-yellow-200 scale-95 shadow-md shadow-yellow-200/10' 
                    : 'border-white/5 opacity-70 hover:opacity-100 hover:scale-95'
                }`}
              >
                <img src={img.url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-yellow-200/10 border border-yellow-200/25 text-yellow-200 text-[9px] uppercase tracking-widest font-bold">
                {product.availabilityStatus.replace('_', ' ')}
              </span>
              {product.newArrival && (
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[9px] uppercase tracking-widest font-bold">
                  New Arrival
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-wide leading-tight mb-4">
              {product.productName}
            </h1>
            <div className="flex items-center gap-4">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-semibold text-yellow-200">₹{product.discountPrice}</span>
                  <span className="text-lg text-white/40 line-through">₹{product.price}</span>
                </>
              ) : (
                <span className="text-3xl font-semibold text-yellow-200">₹{product.price}</span>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-white/60 leading-relaxed text-sm sm:text-base font-light">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-5 rounded-3xl glass-panel hover:border-yellow-200/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-yellow-200/10 border border-yellow-200/25 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-yellow-200" />
                </div>
                <div>
                  <p className="text-[9px] text-white/40 uppercase tracking-wider font-semibold">Quality</p>
                  <p className="text-sm font-medium text-white mt-0.5">1 Gram Gold</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-3xl glass-panel hover:border-yellow-200/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-yellow-200/10 border border-yellow-200/25 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-yellow-200" />
                </div>
                <div>
                  <p className="text-[9px] text-white/40 uppercase tracking-wider font-semibold">Stock</p>
                  <p className="text-sm font-medium text-white mt-0.5">{product.stockQuantity > 0 ? 'In Stock' : 'Limited'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleEnquire}
              disabled={enquiring}
              className="flex-1 bg-gold-gradient text-black font-bold py-4.5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 gold-glow duration-300"
            >
              {enquiring ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
              Enquire on WhatsApp
            </button>
            <Link
              to="/contact"
              className="flex-1 bg-white/5 text-white border border-white/10 font-bold py-4.5 rounded-2xl hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 duration-300"
            >
              <Phone className="w-5 h-5" />
              Request Callback
            </Link>
          </div>

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pt-8 border-t border-white/5"
            >
              <h3 className="text-lg font-serif text-white tracking-wide mb-4">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/40 text-sm font-light">{spec.label}</span>
                    <span className="text-white text-sm font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
