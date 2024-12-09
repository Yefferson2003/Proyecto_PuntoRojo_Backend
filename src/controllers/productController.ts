
import {Response, Request, NextFunction} from 'express'
import Product from '../models/product.model'
import { Op } from 'sequelize'
import SubCategory from '../models/subcategory.model'

export class productController {

    static getProducts = async (req:Request, res:Response) => {
        const { category, subcategory, offer, availability, search, page = 1, limit = 10 } = req.query;

        let filter: any = {} // Objecto para definir el filtro a aplicar a los productos

        if (search && typeof search === 'string') {
            const words = search.split(' ')
            
            filter[Op.or] = [
                { [Op.and]: words.map(word => ({ name: { [Op.iLike]: `%${word}%` } })) },
                { [Op.and]: words.map(word => ({ description: { [Op.iLike]: `%${word}%` } })) },
                { [Op.and]: words.map(word => ({ nit: { [Op.iLike]: `%${word}%` } })) },
            ]
            
        }

        if (category) { // Filtrar por Category
            const categoryId = +category
            const subCategories = await SubCategory.findAll({
                where: { categoryId },  // Filtro por categoría en subcategorías
                attributes: ['id']  // Solo obtenemos los IDs de las subcategorías
            });
            // Si se encuentran subcategorías, añadimos sus IDs al filtro de productos
            const subCategoryIds = subCategories.map(sc => sc.id);
            if (subCategoryIds.length > 0) {
                filter.subCategoryId = subCategoryIds;  // Filtrar por todas las subcategorías encontradas
            }
        }

        if (subcategory) { // Filtrar por SubCategory
            filter.subCategoryId = +subcategory
        }
        if (offer) { // Filtrar por si esta en Offer
            const isOffer = offer === 'true' 
            filter.offer = isOffer
        }
        if (availability) { // Filtrar por si esta disponibilidad
            const isAvailability = availability === 'true' 
            filter.availability = isAvailability
        }

        // Convertir a números y definir `offset` y `limit`
        const pageNumber = parseInt(page as string);
        const limitNumber = parseInt(limit as string);
        const offset = (pageNumber - 1) * limitNumber;
        
        try {
            const { count, rows: products } = await Product.findAndCountAll({
                where: filter,
                limit: limitNumber,
                offset,
                order: [['id', 'DESC']],
            });
            res.json({
                total: count,
                products,
                totalPages: Math.ceil(count / limitNumber),
                currentPage: pageNumber,
            });
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
            console.error(error);
        }
    }

    static getProductById = async (req:Request, res:Response) => {
        try {
            res.json(req.product)
        } catch (error) {
            res.status(500).json('Hubo un Error')
        }
    }

    static createProduct = async (req:Request, res:Response) => {
        const { name, nit, description, imgUrl, availability, priceAfter, priceBefore, iva, offer, subCategoryId} = req.body
        try {
            if (req.user && !req.customer && !req.deliveryMan) {
                const product = Product.create({
                    name, 
                    nit, 
                    description, 
                    imgUrl, 
                    availability, 
                    priceAfter, 
                    priceBefore, 
                    iva, 
                    offer, 
                    subCategoryId
                })
                res.status(201).send('Producto creado correctamente')
                return
            }
            const error = new Error('Usuario no valido');
            res.status(409).json({error: error.message})
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static updateProduct = async (req:Request, res:Response) => {
        const { name, nit, description, imgUrl, availability, priceAfter, priceBefore, iva, offer, subCategoryId} = req.body
        try {
            if (req.user && !req.customer && !req.deliveryMan) {
                await req.product.update({
                    name, 
                    nit, 
                    description, 
                    imgUrl, 
                    availability, 
                    priceAfter, 
                    priceBefore, 
                    iva, 
                    offer, 
                    subCategoryId
                })
                res.send('Producto actualizado correctamente')
                return
            }
            const error = new Error('Usuario no valido');
            res.status(409).json({error: error.message})
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})         
        }
    }

    static changeAvailabilityProduct = async (req:Request, res:Response) => {
        const newAvailability = !req.product.dataValues.availability; // Cambiar la disponibilidad actual
        try {
            if (req.user && !req.customer && !req.deliveryMan) {
                await req.product.update({
                    availability: newAvailability
                });
                res.send('Disponibilidad actualizada correctamente')
            return
            }
            const error = new Error('Usuario no valido');
            res.status(409).json({error: error.message})
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static changeOfferProduct = async (req:Request, res:Response) => {
        const newOffer = !req.product.dataValues.offer; 
        try {
            if (req.user && !req.customer && !req.deliveryMan) {
                await req.product.update({
                    offer: newOffer
                });
                res.send('Estado de oferta actualizada correctamente')
                return
            }
            const error = new Error('Usuario no valido');
            res.status(409).json({error: error.message})
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

}