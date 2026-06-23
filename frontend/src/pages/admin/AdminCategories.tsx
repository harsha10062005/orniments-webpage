import { useEffect, useState, type FormEvent } from 'react'
import api from '../../services/api'
import type { Category } from '../../types/api'

export default function AdminCategories() {
  const [items, setItems] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get<{ items: Category[] }>('/admin/categories')
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

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/admin/categories', { name: name.trim(), slug: slug.trim() })
      setName('')
      setSlug('')
      await load()
    } catch (e: unknown) {
      setError(apiErrorMessage(e))
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this category? Products using it may need to be reassigned.')) return
    setError('')
    try {
      await api.delete(`/admin/categories/${id}`)
      await load()
    } catch (e: unknown) {
      setError(apiErrorMessage(e))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="mt-1 text-sm text-white/60">
          Create a category first, then add products under it.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={handleCreate}
        className="rounded-2xl border border-white/10 bg-black/20 p-5 grid gap-4 sm:grid-cols-2"
      >
        <label className="text-sm text-white/70 sm:col-span-1">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-yellow-200/40"
            placeholder="Rings"
            required
          />
        </label>
        <label className="text-sm text-white/70 sm:col-span-1">
          Slug (URL)
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-yellow-200/40"
            placeholder="rings"
            required
          />
        </label>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-yellow-200 text-black font-semibold px-5 py-2.5 hover:bg-yellow-100"
          >
            Add category
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 text-sm text-white/60">All categories</div>
        {loading ? (
          <div className="p-6 text-white/50 text-sm">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-white/50 text-sm">No categories yet.</div>
        ) : (
          <ul className="divide-y divide-white/10">
            {items.map((c) => (
              <li key={c._id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-white/50">{c.slug}</div>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(c._id)}
                  className="text-sm text-red-300 hover:text-red-200"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
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
