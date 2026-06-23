import { Router } from 'express'
import { publicProductsRouter } from './publicProducts.js'
import { categoriesRouter } from './categories.js'
import { bannersRouter } from './banners.js'
import { instagramRouter } from './instagram.js'
import { enquiriesRouter } from './enquiries.js'
import { publicPagePhotosRouter } from './publicPagePhotos.js'
import { adminRouter } from './admin/index.js'

export const apiRouter = Router()

apiRouter.use('/products', publicProductsRouter)
apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/banners', bannersRouter)
apiRouter.use('/instagram', instagramRouter)
apiRouter.use('/enquiries', enquiriesRouter)
apiRouter.use('/page-photos', publicPagePhotosRouter)

apiRouter.use('/admin', adminRouter)

