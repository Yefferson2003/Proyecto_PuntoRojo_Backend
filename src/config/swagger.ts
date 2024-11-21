import swaggerJSDoc from 'swagger-jsdoc';

const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Autenticación',
                description: 'URL´s para operaciones relacionadas con la Autenticación'
            },
            {
                name: 'Productos',
                description: 'URL´s para operaciones relacionadas con los Productos'
            },
            // {
            //     name: 'Autenticacion',
            //     description: 'URL´s para operaciones relacionadas con la Autenticacion'
            // },
            // {
            //     name: 'Mensajes',
            //     description: 'URL´s para operaciones relacionadas con los Mensajes'
            // },
            {
                name: 'Órdenes',
                description: 'URL´s para operaciones relacionadas con los Pedidos'
            },
            // {
            //     name: 'Clientes',
            //     description: 'URL´s para operaciones relacionadas con los Clientes'
            // },
            // {
            //     name: 'Repartidores',
            //     description: 'URL´s para operaciones relacionadas con los Repartidores'
            // },
        ],
        info: {
            title: 'API REST para un Mercado Virtual',
            version: "1.0.0",
            description: 'Documentación de la API que facilita operaciones y servicios en el mercado virtual.'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // Esto indica que será un token JWT
                },
            },
        },
        
    },
    apis: [
        './src/routes/product.routes.ts',
        './src/routes/category.routes.ts',
        './src/routes/auth.routes.ts',
        './src/routes/message.routes.ts',
        './src/routes/order.routes.ts',
        './src/routes/customer.routes.ts',
        './src/routes/deliveryMan.routes.ts',
        './src/routes/review.routes.ts',
    ]
}
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
