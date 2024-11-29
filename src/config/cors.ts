import { CorsOptions } from 'cors'; // Importa las opciones de configuración para el middleware CORS

// Exporta la configuración de CORS
export const corsConfig: CorsOptions = {
  // Definimos la propiedad 'origin' que controla los orígenes permitidos
    origin: function (origin, callback) {
    // Lista blanca de dominios permitidos. En este caso, se carga desde la variable de entorno FRONTEND_URL
        const whitelist = [process.env.FRONTEND_URL];

        // Si el origen de la solicitud está en la lista blanca
        if (process.argv[2] === '--api') {
            whitelist.push(undefined) // permite trabajar con cors y thunderclient
        }

        if (whitelist.includes(origin)) {
        // Llamamos al callback con 'null' (sin error) y 'true' (permitido)
            callback(null, true);
        } else {
        // Si el origen no está en la lista blanca, lanzamos un error de CORS
            callback(new Error('Error de CORS'));
        }
    }
};

