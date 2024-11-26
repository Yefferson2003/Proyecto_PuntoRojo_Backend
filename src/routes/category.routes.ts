import { Router } from "express";
import { categoryController } from "../controllers/categoryController";
import { subcategoryController } from "../controllers/subcategoryController";
import { categoryExists, subCategoryExists } from "../middlewares/models";
import { validateIdParam, validateNameCategory } from "../middlewares/validation";

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
    validateIdParam('categoryId'),
    categoryExists,
    categoryController.getCategoryById
)

router.post('/', 
    validateNameCategory,
    categoryController.createCategory
)

router.put('/:categoryId', 
    validateIdParam('categoryId'),
    validateNameCategory,
    categoryExists,
    categoryController.updateCategory
)

router.patch('/:categoryId/visibility', 
    validateIdParam('categoryId'),
    categoryExists,
    categoryController.changeVisibility
)
// * Rutas de SubCategory*//
router.get('/:categoryId/subcategories',
    validateIdParam('categoryId'),
    categoryExists,
    subcategoryController.getSubCategories
)

router.get('/:categoryId/subcategories/:subCategoryId',
    validateIdParam('categoryId'),
    validateIdParam('subCategoryId'),
    categoryExists,
    subCategoryExists,
    subcategoryController.getSubCategoryById
)

router.post('/:categoryId/subcategories',
    validateIdParam('categoryId'),
    validateNameCategory,
    categoryExists,
    subcategoryController.createSubCategory
)

router.put('/:categoryId/subcategories/:subCategoryId',
    validateIdParam('categoryId'),
    validateIdParam('subCategoryId'),
    validateNameCategory,
    categoryExists,
    subCategoryExists,
    subcategoryController.updateSubCategory
)

router.patch('/:categoryId/subcategories/:subCategoryId',
    validateIdParam('categoryId'),
    validateIdParam('subCategoryId'),
    categoryExists,
    subCategoryExists,
    subcategoryController.changeVisibility
)
export default router