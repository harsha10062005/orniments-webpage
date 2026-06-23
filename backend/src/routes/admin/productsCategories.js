import { Router } from 'express'
import {
  listAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../../controllers/adminCategoriesController.js'

export const categoriesAdminRouter = Router()

categoriesAdminRouter.get('/', listAdminCategories)
categoriesAdminRouter.post('/', createAdminCategory)
categoriesAdminRouter.put('/:id', updateAdminCategory)
categoriesAdminRouter.delete('/:id', deleteAdminCategory)

