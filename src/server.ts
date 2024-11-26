import express from "express";
import cors from 'cors';
import connectDB from "./config/db";
import router from './routes/index';
import { corsConfig } from "./config/cors";
import { Server } from 'socket.io';
import http from 'http';
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger'
import compression from 'compression'

//** Conectar a la Base de datos **//
connectDB();

//** Uso de Express **//
const app = express();

app.use(compression());

// Middleware para habilitar CORS
app.use(cors(corsConfig));
app.use(express.json()); // Middleware para parsear JSON

// Crear servidor HTTP
const httpServer = http.createServer(app);

// Configuración de Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: corsConfig.origin, 
        methods: ["GET", "POST"]   
    }
});

// Manejo de eventos de Socket.IO
// io.on('connection', (socket) => {
//     console.log('Cliente conectado:', socket.id);

//     socket.on('disconnect', () => {
//         console.log('Cliente desconectado:', socket.id);
//     });
// });


app.set('io', io);

app.use('/api', router);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec) )

export default httpServer;
