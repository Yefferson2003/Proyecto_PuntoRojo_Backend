import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors, validateCategoryId, validateSubCategoryId } from "../middlewares/validation";
import { categoryController } from "../controllers/categoryController";
import { categoryExists, subCategoryExists } from "../middlewares/models";
import { subcategoryController } from "../controllers/subcategoryController";

const router = Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre de la categoría
 *           example: "Electrónica"
 *         visibility:
 *           type: boolean
 *           description: Visibilidad de la categoría
 *           example: true
 *         subCategories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SubCategory'
 *           description: Relación con el modelo SubCategory
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SubCategory:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre de la subcategoría
 *           example: "Teléfonos Móviles"
 *         visibility:
 *           type: boolean
 *           description: Visibilidad de la subcategoría
 *           example: true
 *         categoryId:
 *           type: integer
 *           description: ID de la categoría a la que pertenece
 *           example: 1
 *         category:
 *           $ref: '#/components/schemas/Category'
 *           description: Relación con el modelo Category
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *           description: Relación con el modelo Product
 */


// * Rutas de Category*//
router.get('/', 
    categoryController.getCagetories
)

router.get('/:categoryId', 
    validateCategoryId,
    handleInputErrors,
    categoryExists,
    categoryController.getCategoryById
)

router.post('/', 
    body('name')
        .notEmpty().withMessage('Nombre de la Categoria obligatorio'),
    handleInputErrors,
    categoryController.createCategory
)

router.put('/:categoryId', 
    validateCategoryId,
    body('name')
        .notEmpty().withMessage('Nombre de la Categoria obligatorio'),
    handleInputErrors,
    categoryExists,
    categoryController.updateCategory
)

router.patch('/:categoryId/visibility', 
    validateCategoryId,
    handleInputErrors,
    categoryExists,
    categoryController.changeVisibility
)
// * Rutas de SubCategory*//
router.get('/:categoryId/subcategories',
    validateCategoryId,
    handleInputErrors,
    categoryExists,
    subcategoryController.getSubCategories
)

router.get('/:categoryId/subcategories/:subCategoryId',
    validateCategoryId,
    validateSubCategoryId,
    handleInputErrors,
    categoryExists,
    subCategoryExists,
    subcategoryController.getSubCategoryById
)

router.post('/:categoryId/subcategories',
    validateCategoryId,
    body('name')
        .notEmpty().withMessage('Nombre de la SubCategoria obligatorio'),
    handleInputErrors,
    categoryExists,
    subcategoryController.createSubCategory
)

router.put('/:categoryId/subcategories/:subCategoryId',
    validateCategoryId,
    validateSubCategoryId,
    body('name')
        .notEmpty().withMessage('Nombre de la SubCategoria obligatorio'),
    handleInputErrors,
    categoryExists,
    subCategoryExists,
    subcategoryController.updateSubCategory
)

router.patch('/:categoryId/subcategories/:subCategoryId',
    validateCategoryId,
    validateSubCategoryId,
    handleInputErrors,
    categoryExists,
    subCategoryExists,
    subcategoryController.changeVisibility
)
export default router