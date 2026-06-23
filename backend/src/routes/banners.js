import { Router } from 'express'
import { listBanners } from '../controllers/bannersController.js'

export const bannersRouter = Router()

bannersRouter.get('/', listBanners)

