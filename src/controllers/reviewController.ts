import {Request, Response} from 'express'
import Review from '../models/review.model'
import { where } from 'sequelize';

export class reviewController {

    static getReviewById = async (req: Request, res: Response) => {
        try {
            if (!req.customer) {
                const error = new Error('Acción no valida');
                res.status(409).send({error: error.message})
                return
            }

            const review = await Review.findOne({
                where: {customerId: req.customer.id}
            })

            if (!review) {
                res.send({})
                return
            }

            res.send(review)
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error')
        }
    }

    static getReviewsVisibility = async (req: Request, res: Response) => {
        const { page = 1, limit = 10} = req.query
        try {
            // Convertir a números y definir `offset` y `limit`
            const pageNumber = parseInt(page as string);
            const limitNumber = parseInt(limit as string);
            const offset = (pageNumber - 1) * limitNumber;

            const {count, rows: reviews} = await Review.findAndCountAll({
                where: {visibility: true}
            })

            res.json({
                total: count,
                reviews,
                totalPages: Math.ceil(count / limitNumber),
                currentPage: pageNumber,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error')
        }
    }
    static createReview = async (req: Request, res: Response) => {
        const {description, qualification} = req.body
        try {
            if (!req.customer) {
                const error = new Error('Acción no valida');
                res.status(409).send({error: error.message})
                return
            }

            const reviewExist = await Review.findOne({
                where: {customerId: req.customer.id}
            })

            if (reviewExist) {
                const error = new Error('Ya se creo una reseña');
                res.status(409).send({error: error.message})
                return
            }

            const review = await Review.create({
                description,
                qualification,
                customerId: req.customer.id
            })

            res.send('Reseña creada correctamente')
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error')
        }
    }

    static updateReview = async (req: Request, res: Response) => {
        const {description, qualification} = req.body
        try {
            if (!req.customer) {
                const error = new Error('Acción no valida');
                res.status(409).send({error: error.message})
                return
            }

            await req.review.update({
                description,
                qualification,
            })

            res.send('Reseña actualizada correctamente')
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error')
        }
    }

    static deleteReview = async (req: Request, res: Response) => {
        try {
            if (!req.customer) {
                const error = new Error('Acción no valida');
                res.status(409).send({error: error.message})
                return
            }

            await req.review.destroy()

            res.send('Reseña eliminada correctamente')
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error')
        }
    }

    static changeVisibilityReview = async (req: Request, res: Response) => {
        const {customerId} = req.params
        try {
            if (req.user && !req.customer && !req.deliveryMan) {
                
                const reviewExist = await Review.findOne({
                    where: {customerId}
                })
    
                if (!reviewExist) {
                    const error = new Error('Reseña no Encontrada')
                    res.status(404).json({error: error.message})
                    return 
                }
    
                await reviewExist.update({
                    visibility: !reviewExist.dataValues.visibility
                })
    
                res.send('Visibilidad actualizada correctamente')
                return
            }

            const error = new Error('Acción no valida');
            res.status(409).send({error: error.message})
            return
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error')
        }
    }

    

}