import {Request, Response} from 'express'
import Category from '../models/category.model'
import Product from '../models/product.model'
import SubCategory from '../models/subcategory.model'
import { Op } from 'sequelize'
export class categoryController {

    static getCagetories = async (req: Request, res: Response) => {
        const {visibility} = req.query

        let filter: any = {}

        if (visibility) {
            const isVisibility = visibility === 'true'
            filter.visibility = isVisibility
        }
        try {
            const categories = await Category.findAll({
                where: filter,
                include: [{
                    model: SubCategory,  
                    as: 'subCategories'
                }],
                order: [
                    ['id', 'DESC'], 
                    [{ model: SubCategory, as: 'subCategories' }, 'id', 'DESC'] 
                ]
            })
            res.json(categories)
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static getCategoryById = async (req: Request, res: Response) => {
        try {
            res.json(req.category)
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    

    static createCategory = async (req: Request, res: Response) => {
        const {name} = req.body
        try {
            const category = Category.create({
                name
            })
            res.send('Categoria creada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static updateCategory = async (req: Request, res: Response) => {
        const {name, visibility} = req.body
        try {
            await req.category.update({
                name,
                visibility
            })
            res.send('Categoria actualizada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static changeVisibility = async (req: Request, res: Response) => {
        try {

            const newVisibility = !req.category.dataValues.visibility

            await req.category.update({
                visibility: newVisibility
            })

            // Obtener las subcategorías de la categoría oculta
            const subCategories = await SubCategory.findAll({
                where: { categoryId: req.category.id }
            });

            // Si hay subcategorías, ocultar los productos relacionados
            if (subCategories.length > 0) {
                const subCategoryIds = subCategories.map(sub => sub.id);
                
                // Ocultar los productos que pertenecen a estas subcategorías
                await Product.update(
                    { availability: false },
                    { where: { subCategoryId: { [Op.in]: subCategoryIds } } }
                );
            }

            await SubCategory.update(
                {visibility: false},
                {where : {categoryId: req.category.id}}
            )

            res.send('Visibilidad actualizada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }
}