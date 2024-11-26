import { Router } from "express";
import { messageController } from "../controllers/messageController";
import { authenticate } from "../middlewares/auth";
import { messageExists } from "../middlewares/models";
import { validateIdParam, validateMessageBody } from "../middlewares/validation";

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
    validateIdParam('messageId'),
    messageController.getMessageById
)

router.post('/',
    validateMessageBody,
    messageController.createMessage
)

router.patch('/:messageId',
    validateIdParam('messageId'),
    validateMessageBody,
    messageExists,
    messageController.updateMessage
)
router.patch('/:messageId/visibility',
    validateIdParam('messageId'),
    messageExists,
    messageController.changeVisibilityMessage
)

router.delete('/:messageId',
    validateIdParam('messageId'),
    messageExists,
    messageController.deleteMessage
)

export default router