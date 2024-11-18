import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { customerController } from "../controllers/customerController";
import { handleInputErrors, validateOrderId } from "../middlewares/validation";
import { orderExists } from "../middlewares/models";

const router = Router()

router.get('/orders',
    authenticate,
    customerController.getOrdersByCustomer
)

router.get('/orders/:orderId',
    authenticate,
    validateOrderId,
    handleInputErrors,
    orderExists,
    customerController.getOrdersByCustomerById
)


router.get('/',
    authenticate,
    customerController.getCustomers
)
export default router