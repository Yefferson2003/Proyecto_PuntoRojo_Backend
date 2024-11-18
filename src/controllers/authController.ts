import { Request, Response } from 'express'
import { AuthEmail } from '../emails/AuthEmail'
import Customer from '../models/customer.model'
import Token from '../models/token.model'
import User from '../models/user.model'
import { checkPassword, hashPassword } from '../utils/auth'
import { generateToken } from '../utils/token'
import { generateJWT } from '../utils/jwt'
import DeliveryMan from '../models/deliveryMan.model'

export class authController {
    static createAccountCustomer = async (req : Request,  res : Response) => {
        const {name, password, email, clietType, identification, phone, address, rol = 'user'} = req.body

        try {
            
            // Prevenir duplicados
            const userExist = await User.findOne({
                where: {email}
            })

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
            
            const customer = await Customer.create({
                clietType,
                identification,
                phone,
                address,
                userId: user.id
            })

            //Generar el Token
            const tokenNew = generateToken()
            const token = await Token.create({
                token: tokenNew,
                customerId: customer.id
            })

            //Enviar email
            AuthEmail.sendConfirmationEmail({
                email,
                name,
                token: tokenNew
            })

            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static confirmAccountCustomer = async (req : Request,  res : Response) => {
        const {token} = req.body
        try {
            const tokenExist = await Token.findOne({
                where: {token}
            })

            if (!tokenExist) {
                const error =  new Error('Token no valido')
                res.status(401).json({error: error.message})
                return
            }
            
            

            const customer = await Customer.findOne({
                where: {id : tokenExist.dataValues.customerId} 
            })

            if (!customer) {
                const error = new Error('Cliente no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
    
            await customer.update({
                confirmed: true
            });
    
            await tokenExist.destroy();
            res.status(200).send('Cuenta confirmada correctamente');
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static login = async (req : Request,  res : Response) => {
        const {email, password} = req.body
        try {
            const user = await User.findOne({
                where: {email}
            })

            if (!user) {
                const error = new Error('Usuario no Encontrado')
                res.status(401).json({error: error.message})
                return
            }

            const customerExist = await Customer.findOne({
                include: [{
                    model: User,
                    as: 'user',
                    where: {
                        id: user.id
                    }
                }]
            })

            const deliveryManExist = await DeliveryMan.findOne({
                include: [{
                    model: User,
                    as: 'user',
                    where: {
                        id: user.id
                    }
                }]
            })
            
            if (customerExist && !customerExist.dataValues.confirmed) {

                //Generar el Token
                const tokenNew = generateToken()
                const token = await Token.create({
                    token: tokenNew,
                    customerId: customerExist.id
                })

                //Enviar email
                AuthEmail.sendConfirmationEmail({
                    email: email,
                    name: user.name,
                    token: tokenNew
                })

                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un email')
                res.status(401).json({error: error.message})
                return
            }

            if (deliveryManExist && deliveryManExist.dataValues.status !== 'active') {
                const error = new Error('Cuenta desabilitada')
                res.status(403).json({error: error.message})
                return
            }

            const isPasswordCorrect = await checkPassword(password, user.dataValues.password)
            
            if (!isPasswordCorrect) {
                const error = new Error('Password incorrecta')
                res.status(401).json({error: error.message})
                return
            }

            const token = generateJWT({id: user.id})
            
            res.send(token)
        } catch (error) {
            
        }
    }

    static requestConfirmationCode = async (req : Request,  res : Response) => {
        const {email} = req.body
        try {
            const customerExist = await Customer.findOne({
                include: [{
                    model: User,
                    as: 'user',
                    where: {
                        email
                    }
                }]
            })

            if (!customerExist) {
                const error = new Error('Usuario no Encontrado')
                res.status(401).json({error: error.message})
                return
            }

            if(customerExist.dataValues.confirmed){
                const error = new Error('El usuario ya esta confirmado')
                res.status(403).json({error: error.message})
                return
            }

            //Generar el Token
            const tokenNew = generateToken()
            const token = await Token.create({
                token: tokenNew,
                customerId: customerExist.id
            })

            //Enviar email
            AuthEmail.sendConfirmationEmail({
                email,
                name: customerExist.dataValues.user.dataValues.name,
                token: tokenNew
            })

            res.send('se envio un nuevo token a tu email')
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static forgotPassword = async (req : Request,  res : Response) => {
        const {email} = req.body

        try {

            const customerExist = await Customer.findOne({
                include: [{
                    model: User,
                    as: 'user',
                    where: {
                        email
                    }
                }]
            })

            if (!customerExist) {
                const error = new Error('Usuario no encontrado')
                res.status(401).json({error: error.message})
                return
            }

            //Generar el Token
            const tokenNew = generateToken()
            const token = await Token.create({
                token: tokenNew,
                customerId: customerExist.id
            })

            //Enviar email
            AuthEmail.sendPasswordResetToken({
                email,
                name: customerExist.dataValues.user.dataValues.name,
                token: tokenNew
            })

            res.send('Revisa tu email para instruciones')
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static validateToken = async (req : Request,  res : Response) => {
        const {token} = req.body
        try {
            const tokenExist = await Token.findOne({
                where: {token}
            })

            if (!tokenExist) {
                const error =  new Error('Token no valido')
                res.status(401).json({error: error.message})
                return
            }
            res.send('El token es valido, Define una nueva contraseña ')
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updatePassword = async (req : Request,  res : Response) => {
        const {token} = req.params
        const {password} = req.body
        try {
            const tokenExist = await Token.findOne({
                where: { token },
                include: [{model: Customer,}]
            });
            
            if (!tokenExist || !tokenExist.dataValues.customer) {
                res.status(401).json({ error: 'Token no válido' });
                return;
            }

            // Hash Password
            const hashedPassword = await hashPassword(password)
            tokenExist.destroy()

            const user = await User.findByPk(tokenExist.dataValues.customer.dataValues.userId)
            await user.update({
                password: hashedPassword
            })
            res.send('La contraseña se modificó correctamente')

        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static user = async (req : Request,  res : Response) => {
        try {
            if (req.user && !req.customer &&  !req.deliveryMan) {
                const admin = {
                    user: req.user
                }
                res.json(admin)
            }
    
            if (req.customer) {
                res.json(req.customer)
            }
            
            if (req.deliveryMan) {
                res.json(req.deliveryMan)
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateCustomer = async (req : Request,  res : Response) => {
        const {name, clietType, identification, phone, address} = req.body
        try {
            if (!req.customer && !req.user) {
                const error =  new Error('Usuario no valido')
                res.status(409).json({error: error.message})
                return
            }

            await req.user.update({
                name
            })

            await req.customer.update({
                clietType, 
                identification, 
                phone, 
                address
            })

            res.send('Usuario actualizado correctamente')
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static validatePassword = async (req : Request,  res : Response) => {
        const {password} = req.body
        try {

            if (!req.user && !req.customer) {
                const error =  new Error('Usuario no valido')
                res.status(409).json({error: error.message})
                return
            }

            const isPasswordCorrect = await checkPassword(password, req.user.dataValues.password)
            
            if (!isPasswordCorrect) {
                const error = new Error('Password incorrecta')
                res.status(401).json({error: error.message})
                return
            }

            res.send('La contraseña es valida, Define una nueva contraseña ')
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updatePasswordAccount = async (req : Request,  res : Response) => {
        const {password} = req.body
        try {

            if (!req.user && !req.customer) {
                const error =  new Error('Usuario no valido')
                res.status(409).json({error: error.message})
                return
            }
            
            // Hash Password
            const hashedPassword = await hashPassword(password)
            

            await req.user.update({
                password: hashedPassword
            })

            res.send('La contraseña se modificó correctamente')

        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

}