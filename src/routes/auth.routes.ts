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

router.post('/confirm-accounth/customer',
    body('token')
        .notEmpty().withMessage('El Token es obligatorio'),
    handleInputErrors,
    authController.confirmAccountCustomer
)

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

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    authController.forgotPassword
)

router.post('/validate-token',
    body('token')
    .notEmpty().withMessage('El Token es obligatorio'),
    handleInputErrors,
    authController.validateToken
)

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

export default router