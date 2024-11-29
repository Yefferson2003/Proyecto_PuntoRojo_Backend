import { Response, Request, NextFunction } from "express";
import Category from "../models/category.model";
import SubCategory from "../models/subcategory.model";
import Product from "../models/product.model";
import Order from "../models/order.model";
import Message from "../models/message.model";
import Review from "../models/review.model";

declare global { 
    namespace Express {
        interface Request {
            category: Category,
            subCategory: SubCategory
            product: Product
            order: Order
            message: Message
            review: Review
        }
    }
}

const elementExists = function (res:Response, model: Category | SubCategory | Product | Order | Message | Review) {
    if (!model) {
        const error = new Error('Elemento no Encontrado')
        res.status(404).json({error: error.message})
        return false
    }
    return true
}

export async function categoryExists(req:Request, res:Response, next:NextFunction) {
    const {categoryId} = req.params
    try {
        const category = await Category.findByPk(categoryId)
        if (!elementExists(res, category)) return
        req.category = category
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un Error - models'})
    }
}

export async function subCategoryExists(req:Request, res:Response, next:NextFunction) {
    const {subCategoryId} = req.params
    try {
        const subCategory = await SubCategory.findOne({
            where: {
                id: subCategoryId,
                categoryId: req.category.id
            }
        })
        if (!elementExists(res, subCategory)) return
        req.subCategory = subCategory
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un Error - models'})
    }
}

export async function productExists(req:Request, res:Response, next:NextFunction) {
    const {productId} = req.params
    try {
        const product = await Product.findByPk(productId)
        if (!elementExists(res, product)) return
        req.product = product
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un Error - models'})
    }
}

export async function orderExists(req:Request, res:Response, next:NextFunction) {
    const {orderId} = req.params
    try {
        const order = await Order.findByPk(orderId)
        if (!elementExists(res, order)) return
        req.order = order
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un Error - models'})
    }
}
export async function messageExists(req:Request, res:Response, next:NextFunction) {
    const {messageId} = req.params
    try {
        const message = await Message.findByPk(messageId)
        if (!elementExists(res, message)) return
        req.message = message
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un Error - models'})
    }
}

export async function reviewExists(req:Request, res:Response, next:NextFunction) {
    try {
        const review = await Review.findOne({
            where: {customerId: req.customer.id}
        })
        if (!elementExists(res, review)) return

        req.review = review
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un Error - models'})
    }
}