import { Router } from 'express'
import { listAdminEnquiries, replyAdminEnquiry } from '../../controllers/adminEnquiriesController.js'

export const enquiriesAdminRouter = Router()

enquiriesAdminRouter.get('/', listAdminEnquiries)
enquiriesAdminRouter.patch('/:id', replyAdminEnquiry)

