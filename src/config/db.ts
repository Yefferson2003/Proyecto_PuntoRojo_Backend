import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv'; // Implementamos la librería 'dotenv' para el manejo de variables de entorno
import Category from "../models/category.model";

dotenv.config();

const db = new Sequelize(process.env.DATABASE_URL!, {
    logging: false,
    models: [__dirname + '/../models/**']
}); // Conectando a la base de datos usando la librería 'Sequelize'.


async function connectDB() {
    try {
        await db.authenticate();
        await db.sync() // Sincronizar la BD con nuestros modelos
        console.log('Conexión exitosa a la base de datos');

    } catch (error) {
        console.log(error);
        console.log('Hubo un error en la conexión de la DB');
    }
}

export default connectDB;
