import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Loader2, Trash2, ExternalLink } from 'lucide-react'

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

export default function AdminInstagram() {
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newLink, setNewLink] = useState({ url: '', label: 'Instagram' })

  const fetchLinks = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/instagram')
      setLinks(res.data.items || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLink.url) return

    try {
      setSaving(true)
      await api.post('/admin/instagram', newLink)
      setNewLink({ url: '', label: 'Instagram' })
      fetchLinks()
    } catch (err) {
      console.error(err)
      alert('Failed to add link')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this link?')) return
    try {
      await api.delete(`/admin/instagram/${id}`)
      fetchLinks()
    } catch (err) {
      console.error(err)
      alert('Failed to delete')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Instagram Gallery Links</h2>
        <p className="text-white/60 text-sm">Manage the links for your Instagram gallery section.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-fit space-y-4">
          <h3 className="text-lg font-medium">Add New Link</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Instagram Post URL</label>
              <input
                type="url"
                required
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-yellow-200/50"
                placeholder="https://instagram.com/p/..."
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Label (Optional)</label>
              <input
                type="text"
                value={newLink.label}
                onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-yellow-200/50"
              />
            </div>
            <button
              disabled={saving}
              className="w-full bg-yellow-200 text-black font-semibold py-2.5 rounded-xl hover:bg-yellow-300 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <InstagramIcon className="w-4 h-4" />}
              Save Link
            </button>
          </form>
        </div>

        {/* List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Existing Links</h3>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-200" />
            </div>
          ) : links.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center text-white/40 text-sm">
              No links added yet.
            </div>
          ) : (
            <div className="grid gap-3">
              {links.map((link) => (
                <div key={link._id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-colors group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-gradient-to-tr from-yellow-400 to-pink-500 rounded-lg">
                      <InstagramIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">{link.label}</p>
                      <p className="text-[10px] text-white/40 truncate flex items-center gap-1">
                        <ExternalLink className="w-2.5 h-2.5" />
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
