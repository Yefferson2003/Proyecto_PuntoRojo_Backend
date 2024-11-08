import {Response, Request} from 'express'
import Order from '../models/order.model'
import OrderDetails from '../models/orderDetails.model.'
import Product from '../models/product.model'
import Customer from '../models/customer.model'
import { Op } from 'sequelize'
import User from '../models/user.model'
import DeliveryMan from '../models/deliveryMan.model'

function filterOrdersFromLastTwoDaysCondition() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999); 

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); 

    return {
        createdAt: {
            [Op.between]: [yesterday, endOfToday]
        }
    };
}

export class orderController {

    static getOrders = async (req:Request, res:Response) => {

        const { paymentMethod, deliveryType, search, status, startDate, endDate, page = 1, limit = 10, orderToday} = req.query

        let filter : any = {}
        let filterBySearch: any = {}

        if (search && typeof search === 'string') {
            const words = search.split(' ')
            
            filterBySearch[Op.or] = [
                // { [Op.and]: words.map(word => ({ name: { [Op.iLike]: `%${word}%` } })) },
                { [Op.and]: words.map(word => ({ identification: { [Op.iLike]: `%${word}%` } })) },
            ]
            
        }

        if (startDate && endDate) {
            filter.createdAt = {
                [Op.between]: [new Date(startDate.toString()), new Date(endDate.toString())]
            };
        }
        
        if (req.customer) {
            filter.customerId = req.customer.id
        }

        if (req.deliveryMan) {
            filter.deliveryManId = req.deliveryMan.id
        }

        if (paymentMethod) {
            filter.paymentMethod = paymentMethod
        }

        if(deliveryType) {
            filter.deliveryType = deliveryType
        }

        if (status) {
            filter.status = status
        }

        if (orderToday) {
            filter = { ...filter, ...filterOrdersFromLastTwoDaysCondition() };
        }

        // Convertir a números y definir `offset` y `limit`
        const pageNumber = parseInt(page as string);
        const limitNumber = parseInt(limit as string);
        const offset = (pageNumber - 1) * limitNumber;

        try {
            const { count, rows: orders } = await Order.findAndCountAll({
                attributes: ['id', 'address', 'deliveryType', 'paymentMethod', 'createdAt', 'status'],
                where: filter,
                include: [
                    {
                        model: Customer,
                        as: 'customer',
                        attributes: ['id'],
                        where: filterBySearch,
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['name'],
                            }
                        ],
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
            res.status(500).json({error: 'Hubo un Error'})
            console.log(error);
            
        }
    }

    static getOrderById = async (req:Request, res:Response) => {
        try {
            const order = await Order.findByPk(req.order.id, {
                attributes: ['id', 'address', 'deliveryType', 'paymentMethod', 'createdAt', 'status', 'request', 'completedAt'],
                include: [
                    {
                        model: OrderDetails,
                        include: [
                            {
                                model: Product,
                            },
                        ],
                    },
                    {
                        model: Customer,
                        as: 'customer',
                        include: [
                            {
                                model: User,
                                as: 'user',
                            }
                        ],
                    },
                    {
                        model: DeliveryMan,
                        as: 'deliveryMan',
                        include: [
                            {
                                model: User,
                                as: 'user',
                            }
                        ]
                    }
                ],
            })
            res.json(order)
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }
    
    static createOrder = async (req:Request, res:Response) => {
        const {request, paymentMethod, deliveryType, status, deliveryManId, products, address } = req.body
        try {
            if (req.customer) {
                const order = await Order.create({
                    request, 
                    paymentMethod, 
                    deliveryType, 
                    status, 
                    customerId: req.customer.id,
                    deliveryManId,
                    address
                })         
    
                const orderDetailsPromises =  products.map(item => {
                    return OrderDetails.create({
                        quantity: item.quantity,
                        orderId: order.id,
                        productId: item.productId
                    })
                })
                await Promise.all(orderDetailsPromises);
                res.send('Orden creada correctamente')
            }else{
                const error = new Error('Acción no valida')
                res.status(404).json({error: error.message})
            }
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
            console.log(error);
        }
    }

    static updateProductsOrder = async (req:Request, res:Response) => {
        const {productIds, status} = req.body
        try {
            if (req.user && !req.customer && !req.deliveryMan) {
                await req.order.update({
                    status
                })
    
                await OrderDetails.destroy({
                    where: {
                        orderId: req.order.id,
                        productId: productIds, 
                    },
                });
                res.json('Pedido actualizado correctamente')
            }
            const error = new Error('Acción no valida')
            res.status(404).json({error: error.message})
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static assignDeliveryMan = async (req:Request, res:Response) => {
        const {deliveryManId} = req.body
        try {
            if (req.user && !req.customer && !req.deliveryMan) {


                if (req.order.dataValues.deliveryManId === deliveryManId) {
                    const error = new Error('El Repartidor ya fue asignado')
                    res.status(409).json({error: error.message})
                    return
                }


                await req.order.update({
                    deliveryManId
                })
                res.json('Repartidor asignado correctamente')
                return
            }
            const error = new Error('Acción no valida')
            res.status(404).json({error: error.message})
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static changeStatus = async (req:Request, res:Response) => {
        const {status} = req.body
        try {
            if (status === 'completed') {
                await req.order.update({
                    status,
                    completedAt: new Date
                })
            } else {
                await req.order.update({
                    status
                })

            }
            res.send('Estado actualizado correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }
}