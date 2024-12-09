import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { handleInputErrors, validateOrderId } from "../middlewares/validation";
import { orderExists } from "../middlewares/models";
import { body, query } from "express-validator";
import { authenticate } from "../middlewares/auth";

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         paymentMethod:
 *           type: string
 *           enum:
 *             - counterDelivery
 *             - credit
 *           description: Método de pago del pedido
 *           example: "counterDelivery"
 *         deliveryType:
 *           type: string
 *           enum:
 *             - delivery
 *             - pickup
 *           description: Tipo de entrega del pedido
 *           example: "delivery"
 *         status:
 *           type: string
 *           enum:
 *             - inReview
 *             - pending
 *             - packaging
 *             - sending
 *             - ready
 *             - completed
 *             - return
 *             - cancel
 *           description: Estado del pedido
 *           example: "inReview"
 *         address:
 *           type: string
 *           description: Dirección de entrega del pedido
 *           example: "Calle Falsa 123"
 *         request:
 *           type: string
 *           description: Solicitud especial del pedido
 *           example: "Entregar en la tarde"
 *         completedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de finalización del pedido
 *           example: "2024-11-19T23:52:00.000Z"
 *         customerId:
 *           type: integer
 *           description: ID del cliente asociado
 *           example: 1
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *           description: Relación con el modelo Customer
 *         deliveryManId:
 *           type: integer
 *           description: ID del repartidor asociado (opcional)
 *           example: 2
 *         deliveryMan:
 *           $ref: '#/components/schemas/DeliveryMan'
 *           description: Relación con el modelo DeliveryMan
 *         orderDetails:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderDetails'
 *           description: Relación con el modelo OrderDetails
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderDetails:
 *       type: object
 *       properties:
 *         quantity:
 *           type: integer
 *           description: Cantidad del producto en el pedido
 *           example: 1
 *         orderId:
 *           type: integer
 *           description: ID de la orden asociada
 *           example: 1
 *         order:
 *           $ref: '#/components/schemas/Order'
 *           description: Relación con el modelo Order
 *         productId:
 *           type: integer
 *           description: ID del producto asociado
 *           example: 1
 *         product:
 *           $ref: '#/components/schemas/Product'
 *           description: Relación con el modelo Product
 */


const allowedStatus = ['inReview', 'pending', 'packaging', 'sending', 'ready', 'completed', 'return', 'cancel'];
const allowedPaymentMethod = ['counter-delivery', 'credit']
const allowedDeliveryType = ['delivery', 'pickup']

router.get('/data/chart',
    orderController.getOrderByChart
)
router.get('/data/chart/details',
    orderController.getOrderDetailsByChart
)

router.use(authenticate)
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener órdenes con filtros
 *     tags:
 *       - Órdenes
 *     description: Obtiene todas las órdenes de la base de datos con la posibilidad de aplicar filtros como estado, método de pago, tipo de entrega, rango de fechas, búsqueda por identificación y paginación. Este endpoint requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtra las órdenes por estado.
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *         description: Filtra las órdenes por método de pago.
 *       - in: query
 *         name: deliveryType
 *         schema:
 *           type: string
 *         description: Filtra las órdenes por tipo de entrega.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filtra las órdenes por identificación.
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtra las órdenes por fecha de inicio.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtra las órdenes por fecha de fin.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de la página para la paginación.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de órdenes por página.
 *       - in: query
 *         name: orderToday
 *         schema:
 *           type: boolean
 *         description: Filtra las órdenes creadas en los últimos dos días.
 *     responses:
 *       200:
 *         description: Órdenes obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de órdenes encontradas
 *                   example: 10
 *                 orders:
 *                   type: array
 *                   description: Lista de órdenes
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 totalPages:
 *                   type: integer
 *                   description: Número total de páginas disponibles
 *                   example: 1
 *                 currentPage:
 *                   type: integer
 *                   description: Página actual de la paginación
 *                   example: 1
 *       400:
 *         description: Parámetros de entrada inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Parámetros de entrada inválidos"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Hubo un error"
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */

router.get('/',
    query('status')
        .optional().isIn(allowedStatus).withMessage('Estado Invalido'),
    query('paymentMethod')
        .optional().isIn(allowedPaymentMethod).withMessage('Metodo de Pago Invalido'),
    query('deliveryType')
        .optional().isIn(allowedDeliveryType).withMessage('Tipo de Entrega Invalido'),
    orderController.getOrders
)
/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Obtiene una orden por ID
 *     tags:
 *       - Órdenes
 *     description: Obtiene una orden específica por su ID. Este endpoint incluye detalles de la orden, cliente y repartidor. Este endpoint requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden a obtener
 *     responses:
 *       200:
 *         description: Orden obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de la orden
 *                   example: 1
 *                 address:
 *                   type: string
 *                   description: Dirección de entrega
 *                   example: "Calle Falsa 123"
 *                 deliveryType:
 *                   type: string
 *                   description: Tipo de entrega
 *                   example: "delivery"
 *                 paymentMethod:
 *                   type: string
 *                   description: Método de pago
 *                   example: "counterDelivery"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de creación de la orden
 *                   example: "2024-11-19T23:54:00.000Z"
 *                 status:
 *                   type: string
 *                   description: Estado de la orden
 *                   example: "inReview"
 *                 request:
 *                   type: string
 *                   description: Solicitud especial del pedido
 *                   example: "Entregar en la tarde"
 *                 completedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de finalización de la orden
 *                   example: "2024-11-20T23:54:00.000Z"
 *                 orderDetails:
 *                   type: array
 *                   description: Detalles de la orden
 *                   items:
 *                     $ref: '#/components/schemas/OrderDetails'
 *                 customer:
 *                   type: object
 *                   description: Información del cliente
 *                   $ref: '#/components/schemas/Customer'
 *                 deliveryMan:
 *                   type: object
 *                   description: Información del repartidor
 *                   $ref: '#/components/schemas/DeliveryMan'
 *       400:
 *         description: Parámetros de entrada inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Parámetros de entrada inválidos"
 *       404:
 *         description: Orden no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Orden no encontrada"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Hubo un error"
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */

router.get('/:orderId',
    validateOrderId,
    handleInputErrors,
    orderExists,
    orderController.getOrderById
)
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags:
 *       - Órdenes
 *     description: Crea una nueva orden en la base de datos. Este endpoint requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 description: Método de pago de la orden
 *                 example: "counterDelivery"
 *               deliveryType:
 *                 type: string
 *                 description: Tipo de entrega de la orden
 *                 example: "delivery"
 *               products:
 *                 type: array
 *                 description: Productos de la orden
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: ID del producto
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       description: Cantidad del producto
 *                       example: 2
 *               request:
 *                 type: string
 *                 description: Solicitud especial de la orden
 *                 example: "Por favor entregar en la tarde"
 *               address:
 *                 type: string
 *                 description: Dirección de entrega de la orden
 *                 example: "Calle Falsa 123"
 *               status:
 *                 type: string
 *                 description: Estado de la orden
 *                 example: "pending"
 *               deliveryManId:
 *                 type: integer
 *                 description: ID del repartidor
 *                 example: 2
 *     responses:
 *       201:
 *         description: Orden creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'Orden creada correctamente'
 *       400:
 *         description: Datos de entrada inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Datos de entrada inválidos'
 *       404:
 *         description: Acción no válida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Acción no valida'
 *       500:
 *         description: Hubo un error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Hubo un Error'
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */

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
/**
 * @swagger
 * /api/orders/{orderId}/orderDetails:
 *   patch:
 *     summary: Actualizar los productos de una orden
 *     tags:
 *       - Órdenes
 *     description: Actualiza los productos y el estado de una orden específica por su ID. Este endpoint se utiliza principalmente para acciones de devolución y requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 description: IDs de los productos a actualizar en la orden
 *                 items:
 *                   type: integer
 *                   example: 1
 *               status:
 *                 type: string
 *                 description: Nuevo estado de la orden
 *                 example: "return"
 *     responses:
 *       200:
 *         description: Pedido actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'Pedido actualizado correctamente'
 *       400:
 *         description: Datos de entrada inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Datos de entrada inválidos'
 *       404:
 *         description: Acción no válida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Acción no valida'
 *       500:
 *         description: Hubo un error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Hubo un Error'
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */

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
/**
 * @swagger
 * /api/orders/{orderId}/deliveryMan:
 *   patch:
 *     summary: Asignar un repartidor a una orden
 *     tags:
 *       - Órdenes
 *     description: Asigna un repartidor a una orden específica por su ID. Este endpoint requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryManId:
 *                 type: integer
 *                 description: ID del repartidor a asignar
 *                 example: 2
 *     responses:
 *       200:
 *         description: Repartidor asignado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'Repartidor asignado correctamente'
 *       400:
 *         description: Datos de entrada inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Datos de entrada inválidos'
 *       404:
 *         description: Acción no válida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Acción no valida'
 *       409:
 *         description: El Repartidor ya fue asignado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'El Repartidor ya fue asignado'
 *       500:
 *         description: Hubo un error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Hubo un Error'
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */

router.patch('/:orderId/deliveryMan',
    validateOrderId,
    body('deliveryManId')
        .isInt().withMessage('Id no válido'),
    handleInputErrors,
    orderExists,
    orderController.assignDeliveryMan
)
/**
 * @swagger
 * /api/orders/{orderId}/status:
 *   patch:
 *     summary: Cambiar el estado de una orden
 *     tags:
 *       - Órdenes
 *     description: Cambia el estado de una orden específica por su ID. Este endpoint requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Nuevo estado de la orden
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'Estado actualizado correctamente'
 *       400:
 *         description: Estado inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Estado inválido'
 *       500:
 *         description: Hubo un error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Hubo un Error'
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */

router.patch('/:orderId/status',
    validateOrderId,
    body('status')
        .isIn(allowedStatus).withMessage('Estado Invalido'),
    handleInputErrors,
    orderExists,
    orderController.changeStatus
)



export default router