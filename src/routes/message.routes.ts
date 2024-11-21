import { Router } from "express";
import { body } from "express-validator";
import { messageController } from "../controllers/messageController";
import { authenticate } from "../middlewares/auth";
import { messageExists } from "../middlewares/models";
import { handleInputErrors, validateMessageId } from "../middlewares/validation";

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         visibility:
 *           type: boolean
 *           description: Visibilidad del mensaje
 *           example: false
 *         message:
 *           type: string
 *           description: Contenido del mensaje
 *           example: "Este es un mensaje de ejemplo."
 */


router.get('/',
    messageController.getMessages
)

router.use(authenticate)

router.get('/:messageId',
    validateMessageId,
    handleInputErrors,
    messageController.getMessageById
)

router.post('/',
    body('message')
        .notEmpty().withMessage('El mensaje debe ser obligatorio'),
    handleInputErrors,
    messageController.createMessage
)

router.patch('/:messageId',
    validateMessageId,
    messageExists,
    body('message')
        .notEmpty().withMessage('El mensaje debe ser obligatorio'),
    handleInputErrors,
    messageController.updateMessage
)
router.patch('/:messageId/visibility',
    validateMessageId,
    messageExists,
    handleInputErrors,
    messageController.changeVisibilityMessage
)

router.delete('/:messageId',
    validateMessageId,
    messageExists,
    handleInputErrors,
    messageController.deleteMessage
)

export default router