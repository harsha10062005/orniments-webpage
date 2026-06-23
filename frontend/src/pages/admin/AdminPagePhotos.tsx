import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Loader2, Trash2, Upload, Image as ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminPagePhotos() {
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedPage, setSelectedPage] = useState('about')
  const [file, setFile] = useState<File | null>(null)

  const pages = [
    { id: 'about', name: 'About Page' }
  ]

  const fetchPhotos = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/admin/page-photos?pageName=${selectedPage}`)
      setPhotos(res.data.items || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [selectedPage])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('image', file)
      formData.append('pageName', selectedPage)
      
      await api.post('/admin/page-photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setFile(null)
      fetchPhotos()
    } catch (err) {
      console.error(err)
      alert('Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return
    try {
      await api.delete(`/admin/page-photos/${id}`)
      fetchPhotos()
    } catch (err) {
      console.error(err)
      alert('Failed to delete')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Page Photos</h2>
        <p className="text-white/60 text-sm">Manage dynamic photos displayed on various pages.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Upload Section */}
        <div className="w-full md:w-1/3 space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl h-fit">
          <h3 className="font-medium text-lg">Upload Photo</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Select Page</label>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-200/50"
              >
                {pages.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Image File</label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-yellow-200/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-white/40" />
                  <span className="text-sm text-white/60">
                    {file ? file.name : 'Click to select an image'}
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full bg-yellow-200 text-black font-medium py-2 rounded-xl hover:bg-yellow-300 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload Photo'}
            </button>
          </form>
        </div>

        {/* Carousel / Grid Section */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg capitalize">{selectedPage} Page Photos</h3>
            <span className="text-sm text-white/40">{photos.length} photos</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-200" />
            </div>
          ) : photos.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
              <ImageIcon className="w-12 h-12 text-white/20" />
              <p className="text-white/50">No photos uploaded for this page yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {photos.map((photo, i) => (
                <motion.div
                  key={photo._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5"
                >
                  <img
                    src={photo.imageUrl}
                    alt={`${selectedPage} photo`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(photo._id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
