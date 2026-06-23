import { Router } from 'express'
import { listPagePhotos } from '../controllers/publicPagePhotosController.js'

export const publicPagePhotosRouter = Router()

publicPagePhotosRouter.get('/:pageName', listPagePhotos)
