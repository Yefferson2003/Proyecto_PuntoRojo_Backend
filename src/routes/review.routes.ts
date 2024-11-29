import { Router } from "express";
import { reviewController } from "../controllers/reviewController";
import { authenticate } from "../middlewares/auth";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { reviewExists } from "../middlewares/models";

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           description: Descripción de la reseña
 *           example: "El producto cumplió con todas mis expectativas."
 *         visibility:
 *           type: boolean
 *           description: Visibilidad de la reseña
 *           example: false
 *         qualification:
 *           type: integer
 *           description: Calificación de la reseña
 *           example: 5
 *         customerId:
 *           type: integer
 *           description: ID del cliente asociado
 *           example: 1
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *           description: Relación con el modelo Customer
 */




router.get('/',
    authenticate,
    reviewController.getReviewById
)
router.get('/visibility',
    reviewController.getReviewsVisibility
)

router.post('/',
    authenticate,
    body('qualification').
        isInt({ min: 0, max: 5 }).withMessage('El calificación debe ser un número entre 1 y 5'),
    handleInputErrors,
    reviewController.createReview
)

router.put('/',
    authenticate,
    body('qualification').
        isInt({ min: 1, max: 5 }).withMessage('El calificación debe ser un número entre 1 y 5'),
    reviewExists,
    handleInputErrors,
    reviewController.updateReview
)

router.delete('/',
    authenticate,
    reviewExists,
    reviewController.deleteReview
)

router.patch('/:customerId',
    authenticate,
    param('customerId')
        .isInt().withMessage('Id no válido'),
    handleInputErrors,
    reviewController.changeVisibilityReview
)


export default router