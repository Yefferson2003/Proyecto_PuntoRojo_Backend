import {Request, Response} from 'express'
import Order from '../models/order.model';
import { Op, or } from 'sequelize';
import DeliveryMan from '../models/deliveryMan.model';
import User from '../models/user.model';
import OrderDetails from '../models/orderDetails.model.';
import Product from '../models/product.model';
import Customer from '../models/customer.model';
import Review from '../models/review.model';
import { createSearchFilter } from '../utils';

function filterOrdersFromLastTwoDaysCondition() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999) 

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); 

    return {
        createdAt: {
            [Op.between]: [yesterday, endOfToday]
        }
    };
}

export class customerController {
    static getOrdersByCustomer = async (req:Request, res:Response) => {
        const {overToday, page = 1, limit = 10} = req.query
        try {
            if (!req.customer) {
                const error = new Error('Usuario no valido');
                res.status(401).json({error: error.message})
                return
            }

            let filter : any = {}

            if (overToday) {
                filter = { ...filter, ...filterOrdersFromLastTwoDaysCondition() }
            }else{
                filter.status = 'completed'
            }

            filter.customerId = req.customer.id

            // Convertir a números y definir `offset` y `limit`
            const pageNumber = parseInt(page as string);
            const limitNumber = parseInt(limit as string);
            const offset = (pageNumber - 1) * limitNumber;

            const {count, rows: orders} = await Order.findAndCountAll({
                distinct: true,
                attributes: ['id', 'paymentMethod', 'deliveryType', 'status', 'address', 'createdAt', 'completedAt'],
                where: filter,
                include:[
                    {
                        model: DeliveryMan,
                        as: 'deliveryMan',
                        attributes: ['id', 'phone'],
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['id', 'name']
                            }
                        ]
                    },
                    {
                        model: OrderDetails,
                        as: 'orderDetails',
                        attributes: ['id', 'quantity'],
                        include: [
                            {
                                model: Product,
                                as: 'product',
                                attributes: ['id', 'priceAfter']
                            }
                        ]
                    }
                ],
                order: [['id', 'DESC']],
                limit: limitNumber,
                offset,
            })
            res.json({
                total: count,
                orders,
                totalPages: Math.ceil(count / limitNumber),
                currentPage: pageNumber,
            });
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static getOrdersByCustomerById = async (req:Request, res:Response) => {
        try {
            if (!req.customer) {
                const error = new Error('Usuario no valido');
                res.status(409).json({error: error.message})
                return
            }
            if (req.customer.id !== req.order.dataValues.customerId) {
                const error = new Error('Acción no valida');
                res.status(409).json({error: error.message})
                return
            }

            const order = await Order.findOne({
                where: {id: req.order.id},
                attributes: ['id', 'paymentMethod', 'deliveryType', 'address', 'createdAt', 'completedAt', 'status', 'deliveryManId'],
                include: [
                    {
                        model: OrderDetails,
                        as: 'orderDetails',
                        attributes: ['id', 'quantity'],
                        include: [
                            {
                                model: Product,
                                as: 'product',
                            }
                        ]
                    }
                ]
            })

            res.json(order)
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static getCustomers = async (req:Request, res:Response) => {
        const { page = 1, limit = 10, search} = req.query
        try {
            if (req.user && !req.customer && !req.deliveryMan) {

                let customerFilter = {}

                if (typeof search === 'string') {
                    customerFilter = createSearchFilter(search, ['identification']);
                } 

                // Convertir a números y definir `offset` y `limit`
                const pageNumber = parseInt(page as string);
                const limitNumber = parseInt(limit as string);
                const offset = (pageNumber - 1) * limitNumber;

                const {count, rows: customers} = await Customer.findAndCountAll({
                    where: customerFilter,
                    include: [
                        {
                            model: Review,
                            as: 'review'
                        },
                        {
                            model: User,
                            as: 'user',
                            attributes: { exclude: ['password'] },
                        }
                    ],
                    order: [['id', 'DESC']],
                    limit: limitNumber,
                    offset,
                })

                res.json({
                    total: count,
                    customers,
                    totalPages: Math.ceil(count / limitNumber),
                    currentPage: pageNumber,
                });

                return
            }
            const error = new Error('Usuario no valido');
            res.status(409).json({error: error.message})
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un Error'})
        }
    }
}