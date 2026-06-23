import { Router } from 'express'
import { adminLogin, adminMe } from '../../controllers/authController.js'
import { requireAdmin } from '../../middleware/adminAuth.js'

import { categoriesAdminRouter } from './productsCategories.js'
import {
  productsAdminRouter,
} from './productsProducts.js'
import { bannersAdminRouter } from './banners.js'
import { instagramAdminRouter } from './instagram.js'
import { enquiriesAdminRouter } from './enquiries.js'
import { pagePhotosAdminRouter } from './pagePhotos.js'

export const adminRouter = Router()

adminRouter.post('/login', adminLogin)
adminRouter.get('/me', requireAdmin, adminMe)

adminRouter.use('/products', requireAdmin, productsAdminRouter)
adminRouter.use('/categories', requireAdmin, categoriesAdminRouter)
adminRouter.use('/banners', requireAdmin, bannersAdminRouter)
adminRouter.use('/instagram', requireAdmin, instagramAdminRouter)
adminRouter.use('/enquiries', requireAdmin, enquiriesAdminRouter)
adminRouter.use('/page-photos', requireAdmin, pagePhotosAdminRouter)

