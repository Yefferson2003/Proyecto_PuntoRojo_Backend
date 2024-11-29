import { transport } from "../config/nodemiler"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendPasswordResetToken = async (customer : IEmail) => {
        const info = await transport.sendMail({
            from: 'PuntoRojo <admin@gmail.com>',
            to: customer.email,
            subject: 'Punto rojo - Restablece tu password',
            text: 'Punto rojo - Restablece tu password',
            html: `<p>Hola: ${customer.name}. has solicitado restablecer tu contraseña</p>
                <p>Visita el Siguente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer Contraseña</a>
                <p>E ingresa el siguente código: <b>${customer.token}</b></p>
                <p>Este token espira en 24 horas</p>`
            
        })
    }

    static sendConfirmationEmail = async (customer : IEmail) => {
        const info = await transport.sendMail({
            from: 'PuntoRojo <admin@gmail.com>',
            to: customer.email,
            subject: 'Punto rojo - Confirmar tu cuenta',
            text: 'Punto rojo - Confirmar tu cuenta',
            html: `<p>Hola: ${customer.name}. has creado tu cuenta en el Mercado virtual Punto Rojo, ya casi esta todo listo, solo deber confirmar tu cuneta</p>
                <p>Visita el Siguente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
                <p>E ingresa el siguente código: <b>${customer.token}</b></p>
                <p>Este token espira en 24 horas</p>`
            
        })
    }
}