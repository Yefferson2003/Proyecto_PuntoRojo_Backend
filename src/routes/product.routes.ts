import { Router } from "express";
import { productController } from "../controllers/productController";
import { query } from "express-validator";
import { handleInputErrors, validateBodyProduct, validateProductId } from "../middlewares/validation";
import { productExists } from "../middlewares/models";
import { authenticate } from "../middlewares/auth";

const router = Router()
/**
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: El identificador del Producto
 *                      example: 1
 *                  name:
 *                      type: string    
 *                      description: El nombre del producto del Producto
 *                      example: "Aceite Riquisimo 3000 mlts"
 *                  nit:
 *                      type: string    
 *                      description: El código de barra del producto del Producto
 *                      example:  "701234567895"
 *                  description:
 *                      type: string    
 *                      description: La descripción del Producto (Opcional)
 *                      example: "El Aceite Riquísimo 3000 ml es un aceite vegetal de alta calidad ideal para el uso diario en la cocina. Está diseñado para ofrecer un excelente rendimiento en diversas preparaciones culinarias, desde freír alimentos hasta sazonar ensaladas." 
 *                  imgUrl:
 *                      type: string    
 *                      description: La url de la imagen del Producto
 *                      example:  "//i.imgur.com/abcd123.jpg "
 *                  availability:
 *                      type: boolean    
 *                      description: La disponibilidad del Producto
 *                      example:  true 
 *                  priceBefore:
 *                      type: integer    
 *                      description: El precio que sera subrayado en el frontend del Producto
 *                      example:  24000 
 *                  priceAfter:
 *                      type: integer    
 *                      description: El precio original del Producto
 *                      example:  22000 
 *                  iva:
 *                      type: integer    
 *                      description: El valor de IVA del Producto
 *                      example:  19 
 *                  offer:
 *                      type: boolean    
 *                      description: El estado de oferta del Producto
 *                      example: true
 *                  subCategoryId:
 *                      type: integer    
 *                      description: El identificador de la subcategoria perteneciente del producto
 *                      example: 1
 *
 *          ProductResponse:
 *               type: object
 *               properties:
 *                  total:
 *                      type: integer
 *                      description: Total de productos encontrados
 *                      example: 1
 *                  products:
 *                      type: array
 *                      description: Lista de productos
 *                      items:
 *                          $ref: '#/components/schemas/Product'
 *                  totalPages:
 *                      type: integer
 *                      description: Número total de páginas disponibles
 *                      example: 1
 *                  currentPage:
 *                      type: integer
 *                      description: Página actual de la paginación
 *                      example: 1
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Obtiene una lista de productos 
 *          tags: 
 *              - Productos
 *          description: Retorna una lista de Productos y atributos relacionados con la paginación
 *          responses: 
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/ProductResponse'
 */
router.get('',
    productController.getProducts
)
/**
 * @swagger
 * /api/products/{productId}:
 *  get:
 *      summary: Obtiene un Producto por su Identificador
 *      tags:
 *          - Productos
 *      description: Retorna un Producto basado en su Identificador único.
 *      parameters:
 *          - in: path
 *            name: productId
 *            description: El Identificador del producto que queremos retornar
 *            required: true
 *            schema:
 *                type: integer
 *      responses:
 *          200:
 *              description: Producto encontrado exitosamente
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Identificador no valido
 *          404:
 *              description: Producto no encontrado
 */

router.get('/:productId',
    validateProductId,
    handleInputErrors,
    productExists,
    productController.getProductById
)
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags:
 *       - Productos
 *     description: Crea un nuevo Producto en la base de datos. Este endpoint requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: El nombre del producto.
 *                 example: yogurt alpina
 *               nit:
 *                 type: string
 *                 description: El número de identificación tributaria del producto.
 *                 example: 1982398218841
 *               description:
 *                 type: string
 *                 description: Descripción detallada del producto.
 *                 example: esta es una descripción
 *               imgUrl:
 *                 type: string
 *                 description: URL de la imagen del producto.
 *                 example: https://example.com/image.jpg
 *               availability:
 *                 type: boolean
 *                 description: Disponibilidad del producto (true si está disponible, false si no).
 *                 example: true
 *               priceBefore:
 *                 type: number
 *                 format: float
 *                 description: Precio original del producto antes de un descuento.
 *                 example: 20000
 *               priceAfter:
 *                 type: number
 *                 format: float
 *                 description: Precio actual del producto después de un descuento.
 *                 example: 22000
 *               iva:
 *                 type: number
 *                 format: float
 *                 description: Valor del IVA aplicado al producto.
 *                 example: 19
 *               offer:
 *                 type: boolean
 *                 description: Indica si el producto está en oferta.
 *                 example: true
 *               subCategoryId:
 *                 type: integer
 *                 description: Identificador único de la subcategoría del producto.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Producto creado exitosamente.
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado. Token no válido o no proporcionado.
 *       403:
 *         description: Acceso denegado. Cuenta inactiva.
 *       500:
 *         description: Error interno del servidor.
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */

router.post('',
    authenticate,
    validateBodyProduct,
    handleInputErrors,
    productController.createProduct
)
/**
 * @swagger
 * /api/products:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: 
 *       - Productos
 *     description: Actualiza los detalles de un producto específico basado en su ID. Este endpoint requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *          - in: path
 *            name: productId
 *            description: El Identificador del producto que queremos retornar
 *            required: true
 *            schema:
 *                type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: El nombre del producto.
 *                 example: yogurt alpina
 *               nit:
 *                 type: string
 *                 description: El número de identificación tributaria del producto.
 *                 example: 1982398218841
 *               description:
 *                 type: string
 *                 description: Descripción detallada del producto.
 *                 example: esta es una descripción
 *               imgUrl:
 *                 type: string
 *                 description: URL de la imagen del producto.
 *                 example: https://example.com/image.jpg
 *               availability:
 *                 type: boolean
 *                 description: Disponibilidad del producto (true si está disponible, false si no).
 *                 example: true
 *               priceBefore:
 *                 type: number
 *                 format: float
 *                 description: Precio original del producto antes de un descuento.
 *                 example: 20000
 *               priceAfter:
 *                 type: number
 *                 format: float
 *                 description: Precio actual del producto después de un descuento.
 *                 example: 22000
 *               iva:
 *                 type: number
 *                 format: float
 *                 description: Valor del IVA aplicado al producto.
 *                 example: 19
 *               offer:
 *                 type: boolean
 *                 description: Indica si el producto está en oferta.
 *                 example: true
 *               subCategoryId:
 *                 type: integer
 *                 description: Identificador único de la subcategoría del producto.
 *                 example: 1
 *     responses:
 *        200:
 *            description: Producto actualizado correctamente
 *        400:
 *            description: Solicitud Incorrecta - Datos de Entrada Inválidos
 *        404:
 *            description: Producto no encontrado
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.put('/:productId',
    authenticate,
    validateProductId,
    validateBodyProduct,
    handleInputErrors,
    productExists,
    productController.updateProduct
)
/**
 * @swagger
 * /api/products/{productId}/availability:
 *   patch:
 *     summary: Cambiar la disponibilidad de un producto
 *     tags:
 *       - Productos
 *     description: Cambia la disponibilidad de un Producto en la base de datos. Este endpoint requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a modificar
 *     responses:
 *       200:
 *         description: Disponibilidad actualizada correctamente.
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado. Token no válido o no proporcionado.
 *       403:
 *         description: Acceso denegado. Cuenta inactiva.
 *       409:
 *         description: Usuario no válido.
 *       500:
 *         description: Error interno del servidor.
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */

router.patch('/:productId/availability',
    authenticate,
    validateProductId,
    handleInputErrors,
    productExists,
    productController.changeAvailabilityProduct
)
/**
 * @swagger
 * /api/products/{productId}/offer:
 *   patch:
 *     summary: Cambiar el estado de oferta de un producto
 *     tags:
 *       - Productos
 *     description: Cambia el estado de oferta de un Producto en la base de datos. Este endpoint requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a modificar
 *     responses:
 *       200:
 *         description: Estado de oferta actualizada correctamente.
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado. Token no válido o no proporcionado.
 *       403:
 *         description: Acceso denegado. Cuenta inactiva.
 *       409:
 *         description: Usuario no válido.
 *       500:
 *         description: Error interno del servidor.
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */

router.patch('/:productId/offer',
    authenticate,
    validateProductId,
    handleInputErrors,
    productExists,
    productController.changeOfferProduct
)


export default router