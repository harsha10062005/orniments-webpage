import { Router } from 'express'
import { listCategories } from '../controllers/categoriesController.js'

export const categoriesRouter = Router()

categoriesRouter.get('/', listCategories)

