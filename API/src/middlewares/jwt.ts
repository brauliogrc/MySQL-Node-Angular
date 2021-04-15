import { Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

// Crearemos el Token y enviarlo al FrontEnd
export const checkJwt = (req:Request, res:Response, next:NextFunction) => {
    /**next es una llamada de callback, que si todo va bien se ejecutará */
    const token = <string>req.headers['auth']; // El parametro puede tener cualquier nombre
    let jwtPayload;
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        // Parametros: el token y la key, la key la tendremos en otro fichero
        res.locals.jwtPayload = jwtPayload;
        
    } catch (e) {
        return res.status(401).json( { message: 'No Authorized' } );
        // En caso de error
    }

    const { userId, username } = jwtPayload;
    // El token se genera en base a esas dos propiedades
    const newToken = jwt.sign( {userId, username}, config.jwtSecret, { expiresIn: '1h' } ); // Nos devuele el token generado
    // parametros: propiedades, key, tiempo de expiración del token

    res.setHeader( 'token', newToken);
    
    // Call next
    next(); 

};