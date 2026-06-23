import { Router } from 'express'
import { listInstagram } from '../controllers/instagramController.js'

export const instagramRouter = Router()

instagramRouter.get('/', listInstagram)

