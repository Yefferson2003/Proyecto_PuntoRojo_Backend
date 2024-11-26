import { Router } from "express";
import { reviewController } from "../controllers/reviewController";
import { authenticate } from "../middlewares/auth";
import { reviewExists } from "../middlewares/models";
import { validateIdParam, validateReviewBody } from "../middlewares/validation";

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
    validateReviewBody,
    reviewController.createReview
)

router.put('/',
    authenticate,
    validateReviewBody,
    reviewExists,
    reviewController.updateReview
)

router.delete('/',
    authenticate,
    reviewExists,
    reviewController.deleteReview
)

router.patch('/:customerId',
    authenticate,
    validateIdParam('customerId'),
    reviewController.changeVisibilityReview
)


export default router