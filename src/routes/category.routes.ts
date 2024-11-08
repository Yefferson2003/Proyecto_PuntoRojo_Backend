import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors, validateCategoryId, validateSubCategoryId } from "../middlewares/validation";
import { categoryController } from "../controllers/categoryController";
import { categoryExists, subCategoryExists } from "../middlewares/models";
import { subcategoryController } from "../controllers/subcategoryController";

const router = Router()

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