import {Response, Request, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import Customer from '../models/customer.model';
import { where } from 'sequelize';
import User from '../models/user.model';
import DeliveryMan from '../models/deliveryMan.model';
dotenv.config()

declare global { 
    namespace Express {
        interface Request {
            user: User
            customer: Customer
            deliveryMan : DeliveryMan
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        res.status(401).json({ error: 'No autorizado' });
        return 
    }

    const token = bearer.split(' ')[1];
    
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET as string);
        

        if (typeof decode === 'object' && decode.id) {

            const user = await User.findOne({
                where: {id: decode.id}
            })

            if (user) {
                req.user = user
            }

            const customer = await Customer.findOne({
                where: {userId: decode.id},
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: { exclude: ['password'] }
                    }
                ]
            })

            if (customer) {
                req.customer = customer
            }

            const deliveryMan = await DeliveryMan.findOne({
                where: {userId: decode.id},
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: { exclude: ['password'] }
                    }
                ]
            })

            if (deliveryMan) {
                if (deliveryMan.status === 'inactive') {
                    res.status(403).json({ error: 'Acceso denegado. Cuenta inactiva.' });
                    return;
                }

                req.deliveryMan = deliveryMan
            }
            next()
        } else {
            res.status(401).json({ error: 'Token no válido' });
            return 
        }

    } catch (error) {
        res.status(401).json({ error: 'Token no válido' });
        // console.log(error);
        
        return
    }
};
