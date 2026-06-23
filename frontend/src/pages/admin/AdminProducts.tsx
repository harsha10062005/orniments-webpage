import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import type { Product } from '../../types/api'
import { productPrimaryImage } from '../../types/api'

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get<{ items: Product[] }>('/admin/products', {
        params: { limit: 100 },
      })
      setItems(data.items)
    } catch (e: unknown) {
      setError(apiErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this product?')) return
    setError('')
    try {
      await api.delete(`/admin/products/${id}`)
      await load()
    } catch (e: unknown) {
      setError(apiErrorMessage(e))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-white/60">
            Add images via file upload (Cloudinary) or paste public image URLs.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="rounded-xl bg-yellow-200 text-black font-semibold px-4 py-2.5 hover:bg-yellow-100"
        >
          Add product
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-white/50 text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-6 text-white/60 text-sm">
          No products yet. Create a category, then add a product with photos.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <div
              key={p._id}
              className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] bg-black/40">
                <img
                  src={productPrimaryImage(p)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <div className="font-semibold line-clamp-2">{p.productName}</div>
                <div className="text-sm text-white/60">
                  ₹{p.price}
                  {p.discountPrice ? (
                    <span className="text-yellow-200/90"> · Offer ₹{p.discountPrice}</span>
                  ) : null}
                </div>
                <div className="text-xs text-white/45 flex flex-wrap gap-2">
                  <span>{p.availabilityStatus.replace('_', ' ')}</span>
                  {!p.visibility ? <span className="text-amber-300">Hidden</span> : null}
                  {p.featured ? <span>Featured</span> : null}
                  {p.trending ? <span>Trending</span> : null}
                  {p.newArrival ? <span>New</span> : null}
                </div>
                <div className="mt-auto flex gap-3 pt-2">
                  <Link
                    to={`/admin/products/${p._id}/edit`}
                    className="text-sm font-semibold text-yellow-200 hover:text-yellow-100"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleDelete(p._id)}
                    className="text-sm text-red-300 hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function apiErrorMessage(e: unknown): string {
  if (typeof e === 'object' && e !== null && 'response' in e) {
    const r = e as { response?: { data?: { error?: string } } }
    return r.response?.data?.error || 'Request failed'
  }
  return 'Request failed'
}
