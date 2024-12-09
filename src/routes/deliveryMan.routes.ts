import {  Router } from "express";
import { deliveryManController } from "../controllers/deliveryManController";
import { body, param, query } from "express-validator";
import { handleInputErrors, validateDeliveryManId, validateOrderId } from "../middlewares/validation";
import { authenticate } from "../middlewares/auth";
import { orderExists } from "../middlewares/models";

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
    validateDeliveryManId,
    handleInputErrors,
    deliveryManController.getDeliveryManById
)

router.post('/', 
    query('availability')
    .optional() 
    .custom((value) => {
        if (value !== 'true') {
            throw new Error('El parámetro availability solo puede ser true');
        }
        return true;
    }),
    body('name')
        .notEmpty().withMessage('El Nombre es obligatorio'),
    body('identification')
        .notEmpty().withMessage('La C.C. es obligatorio'),
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Los password no son iguales");
            }
            return true
        }),
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    deliveryManController.createDeliveryMan
)

router.patch('/:deliveryManId/status',
    validateDeliveryManId,
    handleInputErrors,
    deliveryManController.changeStatusDeliveryMan
)
router.patch('/availability',
    deliveryManController.changeAvailabilityDeliveryMan
)

router.get('/orders',
    deliveryManController.getOrdesByDeliveryMan
)

router.get('/orders/:orderId',
    validateOrderId,
    orderExists,
    deliveryManController.getOrdersByDeliveryManById
)

export default router