import { Response, Request, NextFunction } from "express"
import { body, param, validationResult } from "express-validator"

// Captura los errores provenientes del request
export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req); 
    if (!errors.isEmpty()) { 
        res.status(400).json({ errors: errors.array() })
        return
    }
    next(); // Si no hay errores, pasamos al siguiente middleware o controlador
};

export const validateCategoryId = [
    param('categoryId')
        .isInt().withMessage('Id no válido'),
    (req: Request, res: Response, next: NextFunction) => {
        next(); // Si no hay errores de validación, pasamos al siguiente middleware
    }
];

export const validateSubCategoryId = [
    param('subCategoryId')
        .isInt().withMessage('Id no válido'),
    (req: Request, res: Response, next: NextFunction) => {
        next(); // Si no hay errores de validación, pasamos al siguiente middleware
    }
];

export const validateProductId = [
    param('productId')
        .isInt().withMessage('Id no válido'),
    (req: Request, res: Response, next: NextFunction) => {
        next(); // Si no hay errores de validación, pasamos al siguiente middleware
    }
]

export const validateOrderId = [
    param('orderId')
        .isInt().withMessage('Id no válido'),
    (req: Request, res: Response, next: NextFunction) => {
        next(); // Si no hay errores de validación, pasamos al siguiente middleware
    }
]

export const validateDeliveryManId = [
    param('deliveryManId')
        .isInt().withMessage('Id no válido'),
    (req: Request, res: Response, next: NextFunction) => {
        next(); 
    }
]
export const validateMessageId = [
    param('messageId')
        .isInt().withMessage('Id no válido'),
    (req: Request, res: Response, next: NextFunction) => {
        next(); 
    }
]

export const validateBodyProduct = [
    body('name')
        .notEmpty().withMessage('Nombre obligatorio para producto'),
    body('nit')
        .notEmpty().withMessage('Nit obligatorio para producto')
        .isLength({ max: 15 }).withMessage('El Nit no debe exceder los 15 caracteres'),
    body('priceAfter')
        .isFloat().withMessage('dato númerico obligatorio para producto'),
    body('priceBefore')
        .isFloat().withMessage('dato númerico obligatorio para producto'),
    body('subCategoryId')
        .isFloat().withMessage('dato númerico obligatorio para producto'),
]
