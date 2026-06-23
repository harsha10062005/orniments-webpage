import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Loader2, Plus, Trash2, Upload, ExternalLink } from 'lucide-react'

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({ title: '', linkUrl: '', position: 0 })

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/banners')
      setBanners(res.data.items || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file && !formData.title) return

    try {
      setUploading(true)
      const data = new FormData()
      if (file) data.append('image', file)
      data.append('title', formData.title)
      data.append('linkUrl', formData.linkUrl)
      data.append('position', String(formData.position))
      
      await api.post('/admin/banners', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setFile(null)
      setFormData({ title: '', linkUrl: '', position: 0 })
      fetchBanners()
    } catch (err) {
      console.error(err)
      alert('Failed to add banner')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    try {
      await api.delete(`/admin/banners/${id}`)
      fetchBanners()
    } catch (err) {
      console.error(err)
      alert('Failed to delete')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Homepage Banners</h2>
          <p className="text-white/60 text-sm">Manage high-quality visuals for the home page.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-fit space-y-4">
          <h3 className="text-lg font-medium">Add New Banner</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Title (Optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-yellow-200/50"
                placeholder="Ex: Festive Collection"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Link URL (Optional)</label>
              <input
                type="text"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-yellow-200/50"
                placeholder="Ex: /shop?category=rings"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Banner Image</label>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-4 text-center hover:border-yellow-200/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="banner-file"
                />
                <label htmlFor="banner-file" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-5 h-5 text-white/20" />
                  <span className="text-xs text-white/40">{file ? file.name : 'Select high-res image'}</span>
                </label>
              </div>
            </div>
            <button
              disabled={!file || uploading}
              className="w-full bg-yellow-200 text-black font-semibold py-2.5 rounded-xl hover:bg-yellow-300 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Banner
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-medium">Active Banners</h3>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-200" />
            </div>
          ) : banners.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center text-white/40 text-sm">
              No banners found.
            </div>
          ) : (
            <div className="grid gap-4">
              {banners.map((banner) => (
                <div key={banner._id} className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full aspect-[21/9] object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    <div className="flex justify-between items-end">
                      <div>
                        <h4 className="font-semibold text-white">{banner.title || 'Untitled Banner'}</h4>
                        {banner.linkUrl && (
                          <div className="flex items-center gap-1 text-[10px] text-yellow-200/80">
                            <ExternalLink className="w-3 h-3" />
                            {banner.linkUrl}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
