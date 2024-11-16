import {  Router } from "express";
import { deliveryManController } from "../controllers/deliveryManController";
import { body, param, query } from "express-validator";
import { handleInputErrors, validateDeliveryManId } from "../middlewares/validation";
import { authenticate } from "../middlewares/auth";

const router = Router()

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

export default router