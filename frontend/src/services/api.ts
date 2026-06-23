import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const TOKEN_KEY = 'business_admin_token'

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const t = localStorage.getItem(TOKEN_KEY)
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

export default api
