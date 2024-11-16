import { Router } from "express";
import authRoutes from './auth.routes'
import categoryRoutes from './category.routes'
import productRoutes from './product.routes'
import orderRoutes from './order.routes'
import deliveryManRoutes from './deliveryMan.routes'
import customerRoutes from './customer.routes'
import messageRoutes from './message.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/categories', categoryRoutes)
router.use('/products', productRoutes)
router.use('/orders', orderRoutes)
router.use('/deliveryMan', deliveryManRoutes)
router.use('/customer', customerRoutes)
router.use('/messages', messageRoutes)

export default router