import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { TOKEN_KEY } from '../../services/api'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await api.post('/admin/login', {
        email: email.trim(),
        password: password.trim(),
      })
      localStorage.setItem(TOKEN_KEY, data.token)
      navigate('/admin')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl pt-6 pb-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <h1 className="text-3xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-white/60 text-sm">
          Secure admin access to manage products and enquiries.
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 grid gap-4">
          <label className="text-sm text-white/70">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 outline-none focus:border-yellow-200/40"
              type="email"
              required
            />
          </label>
          <label className="text-sm text-white/70">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 outline-none focus:border-yellow-200/40"
              type="password"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-yellow-200 text-black font-semibold px-5 py-3 hover:bg-yellow-100 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

