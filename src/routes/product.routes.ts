import { Router } from "express";
import { productController } from "../controllers/productController";
import { query } from "express-validator";
import { handleInputErrors, validateBodyProduct, validateProductId } from "../middlewares/validation";
import { productExists } from "../middlewares/models";

const router = Router()

router.get('',
    productController.getProducts
)
router.get('/:productId',
    validateProductId,
    handleInputErrors,
    productExists,
    productController.getProductById
)

router.post('',
    validateBodyProduct,
    handleInputErrors,
    productController.createProduct
)

router.put('/:productId',
    validateProductId,
    validateBodyProduct,
    handleInputErrors,
    productExists,
    productController.updateProduct
)

router.patch('/:productId/availability',
    validateProductId,
    handleInputErrors,
    productExists,
    productController.changeAvailabilityProduct
)
router.patch('/:productId/offer',
    validateProductId,
    handleInputErrors,
    productExists,
    productController.changeOfferProduct
)


export default router