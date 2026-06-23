import { Router } from 'express'
import { createEnquiry } from '../controllers/enquiriesController.js'

export const enquiriesRouter = Router()

enquiriesRouter.post('/', createEnquiry)

