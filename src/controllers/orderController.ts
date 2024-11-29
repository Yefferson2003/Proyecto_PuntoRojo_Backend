import {Response, Request} from 'express'
import Order from '../models/order.model'
import OrderDetails from '../models/orderDetails.model.'
import Product from '../models/product.model'
import Customer from '../models/customer.model'
import { Op, or } from 'sequelize'
import User from '../models/user.model'
import DeliveryMan from '../models/deliveryMan.model'


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

const getLastMonthWeeks = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Inicio del mes pasado
    const endOfMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Fin del mes pasado

    const weeks = [];
    let currentStart = new Date(startOfMonth);

    while (currentStart <= endOfMonth) {
        const currentEnd = new Date(currentStart);
        currentEnd.setDate(currentStart.getDate() + 6); // Añade 6 días para completar la semana

        weeks.push({
            start: new Date(currentStart), // Fecha inicial de la semana
            end: new Date(currentEnd > endOfMonth ? endOfMonth : currentEnd), // Fecha final (no puede exceder el fin de mes)
        });

        currentStart.setDate(currentStart.getDate() + 7); // Avanza a la siguiente semana
    }

    return weeks;
}

const getLast7Days = () => {
    const today = new Date();
    const lastWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1); // Ayer como último día
    const lastWeekStart = new Date(lastWeekEnd); // Clonar para evitar referencias
    lastWeekStart.setDate(lastWeekEnd.getDate() - 6); // Retroceder 6 días para completar los 7 días

    return {
        start: lastWeekStart,
        end: lastWeekEnd,
    };
};



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

                req.app.get('io').emit('newOrder');

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
                
                req.app.get('io').emit('changeOrder', {
                    orderId: req.order.id,
                    customerId: req.order.dataValues.customerId,
                    deliveryManId: req.order.dataValues.deliveryManId
                });

                res.json('Pedido actualizado correctamente')
                return
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
                req.app.get('io').emit('assignDeliveryMan', {
                    orderId: req.order.id,
                    customerId: req.order.dataValues.customerId,
                    deliveryManId: req.order.dataValues.deliveryManId
                }); 

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

            req.app.get('io').emit('changeOrder', {
                orderId: req.order.id,
                customerId: req.order.dataValues.customerId,
                deliveryManId: req.order.dataValues.deliveryManId
            }); 

            if (req.order.dataValues.deliveryManId && (status === 'return' || 'completed')) {
                req.app.get('io').emit('changeOrderAdmin')
            }

            res.send('Estado actualizado correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static getOrderByChart = async (req:Request, res:Response) => {
        const {lastMonthWeeks, last7Days} = req.query
        try {
            if (lastMonthWeeks && !last7Days) {
                const weeks = getLastMonthWeeks();
                // Consultar la cantidad de órdenes por semana
                const results = await Promise.all(
                    weeks.map(async ({ start, end }) => {
                        const count = await Order.count({
                            where: {
                                status: 'completed',
                                completedAt: {
                                [Op.between]: [start, end],
                                },
                            },
                        });
            
                        return {
                            date: `${start.toISOString().slice(0, 10)} - ${end.toISOString().slice(0, 10)}`,
                            count,
                        };
                    })
                );
            
                res.status(200).json(results);
                return
            }
            
            if (!lastMonthWeeks && last7Days) {
                const { start, end } = getLast7Days();

                const results = await Promise.all(
                    Array.from({ length: 7 }).map(async (_, i) => {
                        const currentDay = new Date(start);
                        currentDay.setDate(currentDay.getDate() + i);
            
                        const nextDay = new Date(currentDay);
                        nextDay.setDate(currentDay.getDate() + 1);
            
                        const count = await Order.count({
                        where: {
                            status: 'completed',
                            completedAt: {
                            [Op.between]: [currentDay, nextDay],
                            },
                        },
                        });
            
                        return {
                            date: currentDay.toISOString().slice(0, 10),
                            count,
                        };
                    })
                );
                res.status(200).json(results);
                return
            }

            if (!lastMonthWeeks && !last7Days) {
                const error = new Error('Parametros no añadidos')
                res.status(400).json({error: error.message})
                return
            }
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static getOrderDetailsByChart = async (req:Request, res:Response) => {
        const {lastMonthWeeks, last7Days} = req.query
        
        try {
            if (lastMonthWeeks && !last7Days) {
                const weeks = getLastMonthWeeks();
                const results = await Promise.all(
                    weeks.map(async ({ start, end }) => {
                        const orders = await Order.findAll({
                            attributes: ['deliveryType'],
                            where: {
                                status: 'completed',
                                completedAt: {
                                    [Op.between]: [start, end],
                                },
                            },
                            include: [
                                {
                                    model: OrderDetails,
                                    as: 'orderDetails',
                                    include: [
                                        {
                                            model: Product,
                                            as: 'product',
                                            attributes: ['id', 'priceAfter'], // Precio del producto
                                        },
                                    ],
                                },
                            ],
                        });

                        if (!orders) {
                            return {
                                date: `${start.toISOString().slice(0, 10)} - ${end.toISOString().slice(0, 10)}`,
                                total: 0
                            };
                        }

                        const total = (orders || []).reduce((acc, order) => {
                            const orderTotal =  (order.dataValues.orderDetails || []).reduce((orderAcc, detail) => {
                                
                                const productPrice = detail.dataValues.product.dataValues.priceAfter || 0;
                                const quantity = detail.dataValues.quantity || 0;
                
                                return orderAcc + productPrice * quantity;
                            }, 0);

                            console.log(orderTotal);
                            
                
                            // Si aplica costo de domicilio
                            const deliveryCost = order.deliveryType === 'delivery' ? 3000 : 0;
                
                            return acc + orderTotal + deliveryCost;
                        }, 0);
                
                        return {
                            date: `${start.toISOString().slice(0, 10)} - ${end.toISOString().slice(0, 10)}`,
                            total,
                        };
                    })
                );
                
            
                res.status(200).json(results);
                return
            }
            
            if (!lastMonthWeeks && last7Days) {
                const { start, end } = getLast7Days();
                const results = await Promise.all(
                    Array.from({ length: 7 }).map(async (_, i) => {
                        const currentDay = new Date(start);
                        currentDay.setDate(currentDay.getDate() + i);
                
                        const nextDay = new Date(currentDay);
                        nextDay.setDate(currentDay.getDate() + 1);
                
                        const orders = await Order.findAll({
                            attributes: ['deliveryType', 'id'], // Atributos necesarios
                            where: {
                                status: 'completed',
                                completedAt: {
                                    [Op.between]: [currentDay, nextDay],
                                },
                            },
                            include: [
                                {
                                    model: OrderDetails,
                                    as: 'orderDetails',
                                    include: [
                                        {
                                            model: Product,
                                            as: 'product',
                                            attributes: ['id', 'priceAfter'],
                                        },
                                    ],
                                },
                            ],
                        });
                
                        // Validar que orders.rows es un arreglo antes de reducir
                        const total = (orders || []).reduce((acc, order) => {
                            const orderTotal = (order.dataValues.orderDetails || []).reduce((orderAcc, detail) => {
                                const productPrice = detail.dataValues.product.dataValues.priceAfter || 0; // Validar existencia del producto
                                const quantity = detail.dataValues.quantity || 0;
                
                                return orderAcc + productPrice * quantity;
                            }, 0);
                
                            // Costo de domicilio
                            const deliveryCost = order.deliveryType === 'delivery' && orderTotal < 50000 ? 3000 : 0;
                
                            return acc + orderTotal + deliveryCost;
                        }, 0);
                
                        return {
                            date: currentDay.toISOString().slice(0, 10),
                            total,
                        };
                    })
                );
                
                res.status(200).json(results);
                return
            }

            if (!lastMonthWeeks && !last7Days) {
                const error = new Error('Parametros no añadidos')
                res.status(400).json({error: error.message})
                return
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un Error'})
        }
    }
}