import jwt from 'jsonwebtoken'

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null
  if (!token) return res.status(401).json({ error: 'Missing token' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = { id: payload.adminId }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

