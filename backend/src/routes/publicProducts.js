import { Router } from 'express'
import { getProducts, getProductById } from '../controllers/productsController.js'

export const publicProductsRouter = Router()

publicProductsRouter.get('/', getProducts)
publicProductsRouter.get('/:id', getProductById)

