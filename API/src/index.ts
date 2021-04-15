import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import {Request, Response} from "express";

// Reaizacion de importaciones.
import * as cors from 'cors';
import * as helmet from 'helmet';
import routes from './routes'; // Por defeto importa el index contenido en esta carpeta

// Variable de entorno con el puerto
const PORT = process.env.PORT || 3000;

createConnection().then(async () => {

    // create express app
    const app = express();
    // Middlewares
    app.use( cors() );
    app.use( helmet() );
    app.use(express.json());

    // Routes
    app.use('/', routes);
    
    // start express server
    app.listen(PORT, () => console.log(`Server running in port ${PORT}`));
    // Mostramos el mensaje cuando el servidor arranca

}).catch(error => console.log(error));
