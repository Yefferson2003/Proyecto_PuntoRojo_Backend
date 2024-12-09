
import { Response, Request, NextFunction } from "express"
import SubCategory from "../models/subcategory.model"
import Product from "../models/product.model"

export class subcategoryController {

    static getSubCategories = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const subCategories = await SubCategory.findAll({
                where : {categoryId : req.category.id}
            })
            res.json(subCategories)
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static getSubCategoryById = async (req:Request, res:Response, next:NextFunction) => {
        try {
            res.json(req.subCategory)
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static createSubCategory = async (req:Request, res:Response, next:NextFunction) => {
        const {name} = req.body
        try {
            const subCategory = SubCategory.create({
                name,
                categoryId: req.category.id
            })
            res.send('SubCategoria Creada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static updateSubCategory = async (req:Request, res:Response, next:NextFunction) => {
        const {name, visibility} = req.body
        try {
            await req.subCategory.update({
                name,
                visibility
            })
            res.send('SubCategoria actualizada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static changeVisibility = async (req: Request, res: Response) => {
        try {

            const newVisibility = !req.subCategory.dataValues.visibility

            await req.subCategory.update({
                visibility: newVisibility
            })

            await Product.update(
                {availability: false},
                {where : {subCategoryId: req.subCategory.id}}
            )

            res.send('Visibilidad actualizada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }
}