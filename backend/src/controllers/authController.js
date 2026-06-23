import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Admin } from '../models/Admin.js'

async function ensureDefaultAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return

  const exists = await Admin.exists({ email: ADMIN_EMAIL })
  if (exists) return

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt)
  await Admin.create({ email: ADMIN_EMAIL, passwordHash })
}

export async function adminLogin(req, res) {
  await ensureDefaultAdmin()

  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() })
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' })

  const ok = await bcrypt.compare(String(password), admin.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
  res.json({ token })
}

export async function adminMe(req, res) {
  res.json({ admin: req.admin })
}

