import {Request, Response} from 'express'
import User from '../models/user.model'
import { hashPassword } from '../utils/auth'
import DeliveryMan from '../models/deliveryMan.model'
import Order from '../models/order.model'
import Customer from '../models/customer.model'
import OrderDetails from '../models/orderDetails.model.'
import Product from '../models/product.model'

export class deliveryManController {

    static getDeliveryMen = async  (req: Request, res: Response) => {
        const {availability} = req.query
        try {

            let filter : any = {}
            

            if (availability) {
                filter.availability = availability === 'true';
            }

            const deliveryMen = await DeliveryMan.findAll({
                where: filter,
                include: [
                    {
                        model: User,
                        as: 'user'
                    }
                ],
                
                order: [['id', 'DESC']],
            })
            res.json(deliveryMen)
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getDeliveryManById = async (req: Request, res: Response) => {
        const {deliveryManId} = req.params
        const {page = 1, limit = 10} = req.query

        // Convertir a números y definir `offset` y `limit`
        const pageNumber = parseInt(page as string);
        const limitNumber = parseInt(limit as string);
        const offset = (pageNumber - 1) * limitNumber;

        try {

            const { count, rows: orders } = await Order.findAndCountAll({
                attributes: ['id', 'createdAt', 'deliveryType', 'paymentMethod', 'status', 'address',],
                where: {deliveryManId},
                include: [
                    {
                        model: Customer,
                        as: 'customer',
                        attributes: ['id', 'phone', 'identification', 'clietType'],
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['name', 'email', 'id']
                            }
                        ]
                    },
                    {
                        model: OrderDetails,
                        as: 'orderDetails',
                        attributes: ['quantity'],
                        include: [
                            {
                                model: Product,
                                as: 'product',
                                attributes: ['id','name', 'nit', 'priceAfter', 'imgUrl']
                            }
                        ]
                    }
                ],
                limit: limitNumber,
                offset,
                order: [['id', 'DESC']],
            });
            
            res.json({
                total: count,
                orders,
                totalPages: Math.ceil(count / limitNumber),
                currentPage: pageNumber,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static createDeliveryMan = async (req: Request, res: Response) => {
        const {name, password, email, phone,identification, rol = 'deliveryman'} = req.body
        try {

            // Prevenir duplicados
            const userExist = await User.findOne({
                where: {email}
            })
            console.log(userExist);
            

            if (userExist) {
                const error = new Error('El usuario ya esta registrado')
                res.status(409).json({error: error.message})
                return
            }

            // Hash Password
            const hashedPassword = await hashPassword(password)

            // Crear Usuario
            const user = await User.create({
                email,
                password: hashedPassword,
                name,
                rol
            })

            const deliveryMan = await DeliveryMan.create({
                userId : user.id,
                phone,
                identification
            })

            res.send('Repartidor creado correctamente')

        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static changeStatusDeliveryMan = async (req: Request, res: Response) => {
        const {deliveryManId} = req.params
        try {
            
            if (req.user && !req.deliveryMan && !req.customer ) {

                const deliveryManExist = await DeliveryMan.findOne({
                    where: {id : deliveryManId}
                })

                if (!deliveryManExist) {
                    res.status(404).json({ error: 'El repartidor no existe.' })
                    return 
                }

                if (deliveryManExist.dataValues.status === 'active') {
                    await deliveryManExist.update({
                        status: 'inactive'
                    })
                } else {
                    await deliveryManExist.update({
                        status: 'active'
                    })
                }

                res.send('Repartidor actualizado correctamente')

            }else{
                res.status(403).json({ error: 'Acción no permitida. No tienes los permisos necesarios.' });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}