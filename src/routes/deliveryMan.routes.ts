import { Router } from "express";
import { deliveryManController } from "../controllers/deliveryManController";
import { authenticate } from "../middlewares/auth";
import { orderExists } from "../middlewares/models";
import { validateDeliveryMan, validateIdParam, validateUpdateDeliveryMan } from "../middlewares/validation";

const router = Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     DeliveryMan:
 *       type: object
 *       properties:
 *         availability:
 *           type: boolean
 *           description: Disponibilidad del repartidor
 *           example: false
 *         status:
 *           type: string
 *           enum:
 *             - active
 *             - inactive
 *           description: Estado del repartidor
 *           example: "active"
 *         phone:
 *           type: string
 *           description: Número telefónico del repartidor
 *           example: "3101234567"
 *         userId:
 *           type: integer
 *           description: ID del usuario asociado
 *           example: 1
 *         user:
 *           $ref: '#/components/schemas/User'
 *           description: Relación con el modelo User
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 *           description: Relación con el modelo Order
 */

router.use(authenticate)

router.get('/',
    deliveryManController.getDeliveryMen
)

router.get('/:deliveryManId/orders',
    validateIdParam('deliveryManId'),
    deliveryManController.getDeliveryManById
)

router.post('/', 
    validateDeliveryMan,
    deliveryManController.createDeliveryMan
)

router.put('/update',
    validateUpdateDeliveryMan,
    deliveryManController.updateDeliveryMan
)

router.patch('/:deliveryManId/status',
    validateIdParam('deliveryManId'),
    deliveryManController.changeStatusDeliveryMan
)

router.patch('/availability',
    deliveryManController.changeAvailabilityDeliveryMan
)

router.get('/orders',
    deliveryManController.getOrdesByDeliveryMan
)

router.get('/orders/:orderId',
    validateIdParam('orderId'),
    orderExists,
    deliveryManController.getOrdersByDeliveryManById
)

export default router