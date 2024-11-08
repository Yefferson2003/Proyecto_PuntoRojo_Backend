import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { handleInputErrors, validateOrderId } from "../middlewares/validation";
import { orderExists } from "../middlewares/models";
import { body, query } from "express-validator";
import { authenticate } from "../middlewares/auth";

const router = Router()

const allowedStatus = ['inReview', 'pending', 'packaging', 'sending', 'ready', 'completed', 'return', 'cancel'];
const allowedPaymentMethod = ['counter-delivery', 'credit']
const allowedDeliveryType = ['delivery', 'pickup']

router.use(authenticate)

router.get('/',
    query('status')
        .optional().isIn(allowedStatus).withMessage('Estado Invalido'),
    query('paymentMethod')
        .optional().isIn(allowedPaymentMethod).withMessage('Metodo de Pago Invalido'),
    query('deliveryType')
        .optional().isIn(allowedDeliveryType).withMessage('Tipo de Entrega Invalido'),
    orderController.getOrders
)

router.get('/:orderId',
    validateOrderId,
    handleInputErrors,
    orderExists,
    orderController.getOrderById
)

router.post('/',
    body('paymentMethod')
        .notEmpty().withMessage('Método de pago obligatorio para la Orden'),
    body('deliveryType')
        .notEmpty().withMessage('Tipo de entrega obligatorio para la Orden'),
    body('products')
        .notEmpty().withMessage('Productos obligatorios para la Orden'),
    handleInputErrors,
    orderController.createOrder
)

router.patch('/:orderId/orderDetails',
    validateOrderId,
    body('productIds')
        .notEmpty().withMessage('Productos obligatorios para la Orden'),
    body('status')
        .optional().isIn(allowedStatus).withMessage('Estado Invalido'),
    handleInputErrors,
    orderExists,
    orderController.updateProductsOrder
)

router.patch('/:orderId/deliveryMan',
    validateOrderId,
    body('deliveryManId')
        .isInt().withMessage('Id no válido'),
    handleInputErrors,
    orderExists,
    orderController.assignDeliveryMan
)

router.patch('/:orderId/status',
    validateOrderId,
    body('status')
        .isIn(allowedStatus).withMessage('Estado Invalido'),
    handleInputErrors,
    orderExists,
    orderController.changeStatus
)

export default router