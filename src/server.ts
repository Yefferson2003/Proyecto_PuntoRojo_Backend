import express from "express";
import cors from 'cors'
import connectDB from "./config/db";
import router from './routes/index'
import { corsConfig } from "./config/cors";
import './scheduler'


//** Conectar a la Base de datos **//
connectDB()

//** Uso de Express **//
const app = express();
app.use(cors(corsConfig))

app.use(express.json()); // Middleware para parsear JSON
// Aplicar la configuración de los cors

// Definición de rutas base
app.use('/api',  router);

export default app;
