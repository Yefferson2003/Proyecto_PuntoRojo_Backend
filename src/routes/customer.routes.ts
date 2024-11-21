import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { customerController } from "../controllers/customerController";
import { handleInputErrors, validateOrderId } from "../middlewares/validation";
import { orderExists } from "../middlewares/models";

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         clietType:
 *           type: string
 *           enum:
 *             - natural
 *             - legal
 *           description: Tipo de cliente
 *           example: "natural"
 *         identification:
 *           type: string
 *           description: Número de identificación del cliente
 *           example: "123456789"
 *         phone:
 *           type: string
 *           description: Número telefónico del cliente
 *           example: "3101234567"
 *         address:
 *           type: string
 *           description: Dirección del cliente
 *           example: "Calle Falsa 123"
 *         confirmed:
 *           type: boolean
 *           description: Indica si la cuenta está confirmada
 *           example: false
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
 *         review:
 *           $ref: '#/components/schemas/Review'
 *           description: Relación con el modelo Review
 *         token:
 *           $ref: '#/components/schemas/Token'
 *           description: Relación con el modelo Token
 */


router.get('/orders',
    authenticate,
    customerController.getOrdersByCustomer
)

router.get('/orders/:orderId',
    authenticate,
    validateOrderId,
    handleInputErrors,
    orderExists,
    customerController.getOrdersByCustomerById
)


router.get('/',
    authenticate,
    customerController.getCustomers
)
export default router