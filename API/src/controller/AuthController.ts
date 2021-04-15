import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { validate } from 'class-validator';

class AuthController{
    
    static login = async (req: Request, res: Response) => {
        // El req es lo que nos enviará el Frontend
        const { username, password } = req.body;
        // Extraemos el username y password

        // Comprobamos que exitan estas dos propiedades, en caso que no exstan, devolveremos lo que se enceuntra dentro del "if"
        if ( !(username && password) ) {
            return res.status( 400 ).json( { message: 'Username & Password are required!' } );
        }
        
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail( { where: { username } } );
            // En caso de que las propiedades username y password sean dadas, buscaremos el usuario en la DB
        } catch (e) {
            return res.status(400).json( { message: 'Username or password incorrect!' } );
            // En caso de que no tengamos el usuario dado, devolvemos un error
        }

        // Check password
        if ( !user.checkPassword( password ) ) {
            return res.status(400).json( { message: 'Username or passwors are incorrect!' } );
        }

        // Enviamos el token hacia el FrontEnd
        const token = jwt.sign( { userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' } );

        res.jsonp( { message: 'OK', token } );
        // Devolvemos solo el toquen
        // En caso de tener un usuario, lo devolvemos hacia en Fromtend

    };

    static changePassword = async (req:Request, res:Response) =>{
        const { userId } = res.locals.jwtPayload;
        const { oldPassword, newPassword } = req.body;

        if ( !oldPassword && newPassword ) {
            res.status(400).json( { message: 'Old password and new password are required' } );
        }

        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(userId);
        } catch (e) {
            return res.status(400).json( { message: 'Something goes wrong!'});
        }

        if ( !user.checkPassword( oldPassword ) ) {
            return res.status(401).json( { message: 'Check your old password' } );
        }

        user.password = newPassword;
        const validationOpt = { validationError: { target: false, value: false} };
        const errors = await validate( user, validationOpt );

        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        // Hash password
        user.hashPassword();
        userRepository.save( user );

        res.json( { message: 'Password change!' } );
    };

}

export default AuthController;