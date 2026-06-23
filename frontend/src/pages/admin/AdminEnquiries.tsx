import { useState, useEffect } from 'react'
import api from '../../services/api'
import { motion } from 'framer-motion'
import { Loader2, MessageSquare, CheckCircle2, Clock } from 'lucide-react'

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEnquiries = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/enquiries')
      setEnquiries(res.data.items || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/enquiries/${id}/status`, { status })
      fetchEnquiries()
    } catch (err) {
      console.error(err)
      alert('Failed to update status')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4 text-yellow-200" />
      case 'replied': return <MessageSquare className="w-4 h-4 text-blue-400" />
      case 'closed': return <CheckCircle2 className="w-4 h-4 text-green-400" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Customer Enquiries</h2>
          <p className="text-white/60 text-sm">Manage and respond to product enquiries.</p>
        </div>
        <button 
          onClick={fetchEnquiries}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-yellow-200" />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
          <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/40">No enquiries found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {enquiries.map((enq, i) => (
            <motion.div
              key={enq._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                      {getStatusIcon(enq.status)}
                      {enq.status}
                    </span>
                    <span className="text-xs text-white/40">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium">{enq.customerName}</h3>
                  <p className="text-yellow-200 font-medium">{enq.phoneNumber}</p>
                  {enq.productName && (
                    <p className="text-white/60 text-sm">
                      Product: <span className="text-white">{enq.productName}</span>
                    </p>
                  )}
                  <div className="bg-black/20 rounded-xl p-3 text-sm text-white/80 border border-white/5">
                    {enq.message}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 justify-end">
                  <button
                    onClick={() => updateStatus(enq._id, 'replied')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${enq.status === 'replied' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                  >
                    Mark Replied
                  </button>
                  <button
                    onClick={() => updateStatus(enq._id, 'closed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${enq.status === 'closed' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                  >
                    Mark Closed
                  </button>
                  <button
                    onClick={() => updateStatus(enq._id, 'new')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${enq.status === 'new' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                  >
                    Reset to New
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
