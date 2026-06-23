import { useState, type FormEvent, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../../services/api'
import type { Category, Product } from '../../types/api'

export default function AdminProductForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const [productName, setProductName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [price, setPrice] = useState('0')
  const [discountPrice, setDiscountPrice] = useState('')
  const [description, setDescription] = useState('')
  const [availabilityStatus, setAvailabilityStatus] = useState('available')
  const [stockQuantity, setStockQuantity] = useState('1')
  const [featured, setFeatured] = useState(false)
  const [trending, setTrending] = useState(false)
  const [newArrival, setNewArrival] = useState(false)
  const [visibility, setVisibility] = useState(true)

  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  useEffect(() => {
    async function init() {
      try {
        const catRes = await api.get<{ items: Category[] }>('/admin/categories')
        setCategories(catRes.data.items)

        if (isEditing) {
          const { data } = await api.get<Product>(`/admin/products/${id}`)
          setProductName(data.productName)
          setCategoryId(typeof data.category === 'object' ? data.category._id : data.category)
          setPrice(String(data.price))
          setDiscountPrice(data.discountPrice ? String(data.discountPrice) : '')
          setDescription(data.description || '')
          setAvailabilityStatus(data.availabilityStatus)
          setStockQuantity(String(data.stockQuantity))
          setFeatured(data.featured)
          setTrending(data.trending)
          setNewArrival(data.newArrival)
          setVisibility(data.visibility)
          setPreviewUrls(data.images?.map((i) => i.url) || [])
        }
      } catch (e: any) {
        setError(e.response?.data?.error || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [id, isEditing])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      productName,
      categoryId,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      description,
      availabilityStatus,
      stockQuantity: Number(stockQuantity),
      featured,
      trending,
      newArrival,
      visibility,
    }

    const formData = new FormData()
    for (const [k, v] of Object.entries(payload)) {
      if (v !== undefined) {
        formData.append(k, String(v))
      }
    }
    files.forEach((f) => formData.append('images', f))

    try {
      if (isEditing) {
        await api.put(`/admin/products/${id}`, formData)
      } else {
        await api.post('/admin/products', formData)
      }
      navigate('/admin/products')
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-white/50 text-sm">Loading...</div>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="text-white/60 hover:text-white">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-semibold">{isEditing ? 'Edit Product' : 'Add Product'}</h1>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-white/70">
            Product Name *
            <input
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 outline-none focus:border-yellow-200/40"
            />
          </label>
          <label className="text-sm text-white/70">
            Category *
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 outline-none focus:border-yellow-200/40 [&>option]:bg-[#07060b]"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-white/70">
            Price (₹) *
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 outline-none focus:border-yellow-200/40"
            />
          </label>
          <label className="text-sm text-white/70">
            Discount Price (₹)
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 outline-none focus:border-yellow-200/40"
            />
          </label>
          <label className="text-sm text-white/70 sm:col-span-2">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 outline-none focus:border-yellow-200/40 min-h-[100px]"
            />
          </label>
          <div className="sm:col-span-2">
            <span className="text-sm text-white/70 block mb-2">Product Images</span>
            <div className="relative mt-2 w-full rounded-2xl bg-black/20 border-2 border-dashed border-white/20 hover:border-yellow-200/50 transition-colors p-8 flex flex-col items-center justify-center min-h-[160px]">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    const selected = Array.from(e.target.files)
                    setFiles(selected)
                    setPreviewUrls(selected.map((f) => URL.createObjectURL(f)))
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <svg className="w-8 h-8 text-white/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <div className="text-sm font-medium text-white/80">Drag and drop images here</div>
              <div className="text-xs text-white/50 mt-1">or click to browse files</div>
            </div>
            
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {previewUrls.map((url, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10 relative group">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            {isEditing && files.length > 0 && (
              <p className="mt-2 text-xs text-yellow-200/80">
                Note: Uploading new images will replace all existing images for this product.
              </p>
            )}
          </div>
          
          <label className="text-sm text-white/70">
            Availability Status
            <select
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 outline-none focus:border-yellow-200/40 [&>option]:bg-[#07060b]"
            >
              <option value="available">Available</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </label>

          <label className="text-sm text-white/70">
            Stock Quantity
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 outline-none focus:border-yellow-200/40"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
          <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
            <input
              type="checkbox"
              checked={visibility}
              onChange={(e) => setVisibility(e.target.checked)}
              className="w-4 h-4 accent-yellow-200"
            />
            Visible
          </label>
          <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-yellow-200"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
            <input
              type="checkbox"
              checked={trending}
              onChange={(e) => setTrending(e.target.checked)}
              className="w-4 h-4 accent-yellow-200"
            />
            Trending
          </label>
          <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
            <input
              type="checkbox"
              checked={newArrival}
              onChange={(e) => setNewArrival(e.target.checked)}
              className="w-4 h-4 accent-yellow-200"
            />
            New Arrival
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-yellow-200 text-black font-semibold px-6 py-3 hover:bg-yellow-100 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
