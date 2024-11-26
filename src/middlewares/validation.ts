import { NextFunction, Request, Response } from "express";
import { z } from 'zod';
import Token from "../models/token.model";

const clientType = ['natural', 'legal'] as const;
const allowedStatus = ['inReview', 'pending', 'packaging', 'sending', 'ready', 'completed', 'return', 'cancel'];
const allowedPaymentMethod = ['counter-delivery', 'credit']
const allowedDeliveryType = ['delivery', 'pickup']

const idSchema = z.string().min(1, "El ID no puede estar vacío").regex(/^\d+$/, "El ID debe ser un número válido");

const productSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    nit: z.string().min(1, "El NIT es obligatorio").max(15, "El NIT no debe exceder los 15 caracteres"),
    priceAfter: z.number().positive("El precio después debe ser un número positivo"),
    priceBefore: z.number().positive("El precio antes debe ser un número positivo"),
    subCategoryId: z.number().int("El subCategoryId debe ser un número entero"),
    iva: z.number().int().min(0).max(100, "El IVA debe ser un valor entre 0 y 100")
});

const customerSchema = z.object({
    name: z.string().min(1, "El Nombre es obligatorio"),
    password: z.string()
        .min(8, "El password es muy corto, minimo 8 caracteres"),
    password_confirmation: z.string()
        .min(1, "La confirmación de la contraseña es obligatoria"),
    email: z.string().email("Email no válido"),
    clietType: z.enum(clientType).refine(value => clientType.includes(value), {
        message: 'Tipo de cliente invalido',
    }),
    identification: z.string().min(1, "Número de identificación obligatorio"),
    phone: z.string()
        .length(10, "El número télefonico debe tener 10 digitos")
        .regex(/^\d+$/, "El número telefónico solo debe contener dígitos"),
    address: z.string().min(1, "La dirección es obligatoria"),
}).refine(data => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
});

const loginSchema = z.object({
    password: z.string()
        .min(8, "El password es muy corto, minimo 8 caracteres"),
    email: z.string().email("Email no válido"),
})

const tokenSchema = z.object({
    token: z.string().min(1, "El Token es obligatorio"),
})

const emailSchema = z.object({
    email: z.string().email("Email no válido"),
})

export const validateIdParam = (paramName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = idSchema.safeParse(req.params[paramName]);
        if (!result.success) {
            res.status(400).json({ errors: result.error.errors });
            return
        }
        next();
    };
};

export const validateCustomerBody = (req: Request, res: Response, next: NextFunction) => {
    const result = customerSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};
export const validateLoginBody = (req: Request, res: Response, next: NextFunction) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};

export const validateTokenBody = (req: Request, res: Response, next: NextFunction) => {
    const result = tokenSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};
export const validateEmailBody = (req: Request, res: Response, next: NextFunction) => {
    const result = emailSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};

export const validateProductBody = (req: Request, res: Response, next: NextFunction) => {
    const result = productSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next(); 
};


const updatePasswordSchema = z.object({
    token: z.string()
        .regex(/^\d+$/, "Token no válido"), 
    password: z.string()
        .min(8, "El password es muy corto, mínimo 8 caracteres"),
    password_confirmation: z.string()
        .min(1, "La confirmación de la contraseña es obligatoria"),
}).refine(data => data.password === data.password_confirmation, {
    message: "Los password no son iguales",
    path: ["password_confirmation"],
});

export const validateUpdatePassword = (req, res, next) => {
    const result = updatePasswordSchema.safeParse({
        token: req.params.token,
        password: req.body.password,
        password_confirmation: req.body.password_confirmation
    });

    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }

    next();
};

const updateCustomerSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    clientType: z.enum(['type1', 'type2', 'type3'], {
        errorMap: () => ({ message: 'Tipo de cliente inválido' }),
    }),
    identification: z.string().min(1, "La identificación es obligatoria"),
    phone: z.string()
        .length(10, "El número telefónico debe tener 10 dígitos")
        .regex(/^\d+$/, "El número telefónico solo debe contener dígitos"),
    address: z.string().min(1, "La dirección es obligatoria"),
});

export const validateCustomerUpdate = (req: Request, res: Response, next: NextFunction) => {
    const result = updateCustomerSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }

    next();
};

const updatePasswordAccountSchema = z.object({
    password: z.string()
        .min(8, "El password es muy corto, mínimo 8 caracteres"),
    password_confirmation: z.string()
        .min(1, "La confirmación de la contraseña es obligatoria"),
}).refine(data => data.password === data.password_confirmation, {
    message: "Los password no son iguales",
    path: ["password_confirmation"],
});

export const validateUpdatePasswordAccountUpdate = (req: Request, res: Response, next: NextFunction) => {
    const result = updatePasswordAccountSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};

const passwordSchema = z.object({
    password: z.string()
        .min(8, "El password es muy corto, mínimo 8 caracteres"),
})

export const validatepassword = (req: Request, res: Response, next: NextFunction) => {
    const result = passwordSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};

const nameCategorySchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
})

export const validateNameCategory = (req: Request, res: Response, next: NextFunction) => {
    const result = nameCategorySchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};

const createDeliveryManSchema = z.object({
    name: z.string().min(1, "El Nombre es obligatorio"),
    identification: z.string().min(1, "La C.C. es obligatorio"),
    password: z.string().min(8, "El password es muy corto, mínimo 8 caracteres"),
    password_confirmation: z.string().min(8, "El password es muy corto, mínimo 8 caracteres"),
    email: z.string().email("Email no válido"),
    phone: z.string()
        .length(10, "El número telefónico debe tener 10 dígitos")
        .regex(/^\d+$/, "El número telefónico solo debe contener dígitos"),
    
}).refine(data => data.password === data.password_confirmation, {
    message: "Los password no son iguales",
    path: ["password_confirmation"],
});
const updateDeliveryManSchema = z.object({
    name: z.string().min(1, "El Nombre es obligatorio"),
    identification: z.string().min(1, "La C.C. es obligatorio"),
    phone: z.string()
        .length(10, "El número telefónico debe tener 10 dígitos")
        .regex(/^\d+$/, "El número telefónico solo debe contener dígitos"),
    
})

export const validateDeliveryMan = (req: Request, res: Response, next: NextFunction) => {
    const result = createDeliveryManSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};
export const validateUpdateDeliveryMan = (req: Request, res: Response, next: NextFunction) => {
    const result = updateDeliveryManSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};

const messageSchema = z.object({
    message: z.string().min(1, "El Nombre es obligatorio"),
})

export const validateMessageBody = (req: Request, res: Response, next: NextFunction) => {
    const result = messageSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};

const reviewSchema  = z.object({
    qualification: z.number().int().min(0).max(5, "La calificación debe ser un número entre 0 y 5"),
})

export const validateReviewBody = (req: Request, res: Response, next: NextFunction) => {
    const result = reviewSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};

const getOrdersQuerySchema = z.object({
    status: z.string().optional().refine(val => allowedStatus.includes(val), {
        message: 'Estado Invalido',
    }),
    paymentMethod: z.string().optional().refine(val => allowedPaymentMethod.includes(val), {
        message: 'Metodo de Pago Invalido',
    }),
    deliveryType: z.string().optional().refine(val => allowedDeliveryType.includes(val), {
        message: 'Tipo de Entrega Invalido',
    }),
})


export const validateQueryParamsOrder  = (req: Request, res: Response, next: NextFunction) => {
    const result = getOrdersQuerySchema.safeParse(req.query);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};

const createOrderBodySchema = z.object({
    status: z.string().optional().refine(val => allowedStatus.includes(val), {
        message: 'Estado Invalido',
    }),
    paymentMethod: z.string().optional().refine(val => allowedPaymentMethod.includes(val), {
        message: 'Metodo de Pago Invalido',
    }),
    deliveryType: z.string().optional().refine(val => allowedDeliveryType.includes(val), {
        message: 'Tipo de Entrega Invalido',
    }),
});

export const validateOrderBody   = (req: Request, res: Response, next: NextFunction) => {
    const result = createOrderBodySchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};

const allowedStatusOrder = ['inReview', 'pending', 'packaging', 'sending', 'ready', 'completed', 'return', 'cancel'] as const;

const updateOrderDetailsSchema = z.object({
    status: z.enum(allowedStatusOrder).optional(),
});

// Middleware de validación con Zod
export const validateOrderDetailsBody = (req: Request, res: Response, next: NextFunction) => {
    const result = updateOrderDetailsSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};

const deliveryManIdSchema = z.object({
    deliveryManId: z.enum(allowedStatusOrder).optional(),
});

export const validatedeliveryManId= (req: Request, res: Response, next: NextFunction) => {
    const result = deliveryManIdSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: result.error.errors });
        return
    }
    next();
};