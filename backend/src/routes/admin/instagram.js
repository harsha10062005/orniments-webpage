import { Router } from 'express'
import { listAdminInstagram, upsertAdminInstagram } from '../../controllers/adminInstagramController.js'

export const instagramAdminRouter = Router()

instagramAdminRouter.get('/', listAdminInstagram)
instagramAdminRouter.post('/', upsertAdminInstagram)

