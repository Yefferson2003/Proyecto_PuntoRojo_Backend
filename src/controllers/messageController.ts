import {Request, Response} from 'express'
import Message from '../models/message.model'

export class messageController {
    static getMessages = async  (req: Request, res: Response) => {
        const {visibility} = req.query
        try {

            let filter : any = {}
            
            if (visibility) {
                const isVisibility = visibility === 'true'
                filter.visibility = isVisibility
            }

            const messages = await Message.findAll({
                where: filter,
                order: [['id', 'DESC']]
            })
            res.json(messages)
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    static getMessageById = async  (req: Request, res: Response) => {
        const {messageId} = req.params
        try {
            const message = await Message.findByPk(messageId)

            if (!message) {
                const error = new Error('Mensaje no encontrado');
                res.status(404).json({error : error.message})
                return
            }

            res.json(message)
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static createMessage = async  (req: Request, res: Response) => {
        const {message} = req.body
        try {
            const mess = await Message.create({
                message
            })
            res.send('mensaje creado correctamente')
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateMessage = async  (req: Request, res: Response) => {
        const {message} = req.body
        try {

            await req.message.update({
                message
            })

            res.send('mensaje actualizado correctamente')
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static changeVisibilityMessage = async  (req: Request, res: Response) => {

        try {
            await req.message.update({
                visibility: !req.message.dataValues.visibility
            })

            res.send('Visibilidad actualizada correctamente')
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    static deleteMessage = async  (req: Request, res: Response) => {
        try {
            await req.message.destroy()
            res.send('Mensaje eliminado correctamente')
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}