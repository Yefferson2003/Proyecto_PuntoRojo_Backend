import { Router } from "express";
import { authController } from "../controllers/authController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { authenticate } from "../middlewares/auth";

const clientType = ['natural', 'legal']

const router = Router()

router.post('/create-accouth/customer', 
    body('name')
        .notEmpty().withMessage('El Nombre es obligatorio'),
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
    body('clietType')
        .isIn(clientType).withMessage('Tipo de cliente invalido'),
    body('identification')
        .notEmpty().withMessage('Número de identificación obligatorio'),
    body('phone')
        .isLength({max: 10, min: 10}).withMessage('El número télefonico debe tener 10 digitos')
        .isNumeric().withMessage('El número telefónico solo debe contener dígitos'),
    body('address')
        .notEmpty().withMessage('La dirección es obligatoria '),
    handleInputErrors,
    authController.createAccountCustomer
)
/**
 * @swagger
 * /api/auth/confirm-accounth/customer:
 *   post:
 *     summary: Confirma una cuenta de cliente
 *     tags: 
 *       - Autenticación
 *     description: Confirma una cuenta de cliente verificando el token de confirmación. Este endpoint se usa después de que un cliente se registra para activar su cuenta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: El token de confirmación.
 *                 example: "abc123def456"
 *     responses:
 *       200:
 *         description: Cuenta confirmada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'Cuenta confirmada correctamente'
 *       401:
 *         description: Token no válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Token no válido'
 *       404:
 *         description: Cliente no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Cliente no encontrado'
 *       500:
 *         description: Hubo un error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Error interno'
 */

router.post('/confirm-accounth/customer',
    body('token')
        .notEmpty().withMessage('El Token es obligatorio'),
    handleInputErrors,
    authController.confirmAccountCustomer
)
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuario
 *     description: Permite a un usuario loguearse usando su correo electrónico y contraseña.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario.
 *                 example: usuario@ejemplo.com
 *               password:
 *                 type: string
 *                 description: La contraseña del usuario.
 *                 example: 'contraseñaSegura123'
 *     responses:
 *       200:
 *         description: El token JWT generado para el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       401:
 *         description: Error de autenticación, usuario no encontrado o cuenta no confirmada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Usuario no Encontrado'
 *       403:
 *         description: Error de autenticación, cuenta deshabilitada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Cuenta deshabilitada'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Error interno'
 */

router.post('/login',
    body('email')
        .isEmail().withMessage('Email no válido'),
    body('password')
        .notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    authController.login
)

router.post('/resquest-code',
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    authController.requestConfirmationCode
)
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicita restablecimiento de contraseña
 *     tags: 
 *       - Autenticación
 *     description: Envia un correo electrónico con instrucciones para restablecer la contraseña del usuario. Este endpoint verifica si el usuario existe y genera un token de restablecimiento de contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario registrado.
 *                 example: "usuario@example.com"
 *     responses:
 *       200:
 *         description: Revisa tu email para instrucciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'Revisa tu email para instrucciones'
 *       401:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Usuario no encontrado'
 *       500:
 *         description: Hubo un error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Hubo un error'
 */

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    authController.forgotPassword
)
/**
 * @swagger
 * /api/auth/validate-token:
 *   post:
 *     summary: Valida el token de restablecimiento de contraseña
 *     tags: 
 *       - Autenticación
 *     description: Valida el token enviado al correo electrónico del usuario para restablecer la contraseña. Este endpoint verifica si el token es válido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: El token de restablecimiento de contraseña.
 *                 example: "abc123def456"
 *     responses:
 *       200:
 *         description: El token es valido, Define una nueva contraseña.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'El token es valido, Define una nueva contraseña'
 *       401:
 *         description: Token no válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Token no válido'
 *       500:
 *         description: Hubo un error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Hubo un error'
 */

router.post('/validate-token',
    body('token')
    .notEmpty().withMessage('El Token es obligatorio'),
    handleInputErrors,
    authController.validateToken
)
/**
 * @swagger
 * /api/auth/update-password/{token}:
 *   post:
 *     summary: Actualiza la contraseña del usuario
 *     tags: 
 *       - Autenticación
 *     description: Actualiza la contraseña del usuario utilizando un token de restablecimiento de contraseña. Este endpoint verifica el token y permite definir una nueva contraseña.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: El token de restablecimiento de contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: La nueva contraseña del usuario.
 *                 example: "nuevoPassword123"
 *               password_confirmation:
 *                 type: string
 *                 description: Confirmación de la nueva contraseña del usuario.
 *                 example: "nuevoPassword123"
 *     responses:
 *       200:
 *         description: La contraseña se modificó correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'La contraseña se modificó correctamente'
 *       401:
 *         description: Token no válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Token no válido'
 *       500:
 *         description: Hubo un error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Hubo un error'
 */

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('Token no valido'),
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Los password no son iguales");
                
            }
            return true
        }),
    handleInputErrors,
    authController.updatePassword
)

router.get('/user',
    authenticate,
    authController.user
)
router.put('/customer/update',
    authenticate,
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('clietType')
        .isIn(clientType).withMessage('Tipo de cliente invalido'),
    body('identification')
        .notEmpty().withMessage('La identificación es obligatoria'),
    body('phone')
        .isLength({max: 10, min: 10}).withMessage('El número télefonico debe tener 10 digitos')
        .isNumeric().withMessage('El número telefónico solo debe contener dígitos'),
    body('address')
        .notEmpty().withMessage('La dirección es obligatoria'),
    handleInputErrors,
    authController.updateCustomer
)

router.post('/validate-password',
    authenticate,
    body('password')
    .notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    authController.validatePassword
)

router.post('/update-password',
    authenticate,
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Los password no son iguales");
                
            }
            return true
        }),
    handleInputErrors,
    authController.updatePasswordAccount
)
export default router