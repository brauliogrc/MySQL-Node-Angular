import {getRepository} from "typeorm";
import { Request, Response} from "express";
import { User } from '../entity/User';

import { validate } from 'class-validator';
// Nos ayuda a crear las validaciones de nuestros capos. Est dependencia se instaló al inicio del proyecto

export class UserController {

    static getAll = async (req: Request, res: Response) => {
        const userRepositoy = getRepository( User );
        let users;

        try {
            users = await userRepositoy.find( { select: ['id', 'username', 'role'] } );
            // Solo nos devolverá el id, username y role
        } catch (e) {
            return res.status(404).json( { message: 'Something goes wrong!' } );
        }
        // Nos va a recuperar todas las entidades que coincidan

        // Comprobamos si tenemos un usuario o no
        if (users.length > 0) {
            res.send( users );
        } else{
            res.status(404).json( { message: 'No result' } );
        }
    };

    static getById = async (req: Request, res: Response) => {
        console.log('Get by id');
        
        const { id } = req.params;
        // Esto quiere decir que en la URL vienen los parametros y lo recuperamos quí

        const userRepostory = getRepository(User);

        try {
            const user = await userRepostory.findOneOrFail(id);
            res.send(user);
        } catch (e) {
            return res.status(404).json( { message: 'Not result' } );
        }
    };

    static newUser = async (req: Request, res: Response) => {
        const {username, password, role} = req.body;
        const user = new User();
        // Nueva instancia de la entity

        user.username = username;
        // Será igual el username que nos llegue desde el FrontEnd
        user.password = password;
        // Será igual el password que nos llegue desde el FrontEnd
        user.role = role;
        // Será igual el rol que nos llegue desde el FrontEnd

        // Validaciones
        const validationOpt = { validationError: { target: false, value: false} };
        const errors = await validate( user, validationOpt );
        if (errors.length > 0) {
            return res.status(400).json( errors );
        }

        const userRepository = getRepository(User);
        try {
            user.hashPassword();
            // Llamamos al método para la encrptación de la contraseña

            await userRepository.save(user);
            // Guardamos el User en la base de datos
        } catch (e) {
            return res.status(409).json( { message: 'Username already exist' } );
            // Todos los status relacionados con 400 tiene que ver con problemas
        }

        // All ok
        res.send( ' User created' );
    };

    static editUser = async (req: Request, res: Response) => {
        // Recuperamos la información que proviene desde el FrontEnd
        let user;
        const { id } = req.params;
        const { username, role } = req.body;

        const userRepository = getRepository( User );

        // Try get user
        try {
            user = await userRepository.findOneOrFail( id );
            // Buscamos el usuario y lo almacenamos en la vaiable

            // Iguallamos a los datos que vienen desde el FrontEnd
            /**Modificamos los valores que provienen desde la base de datos por los valores que recivimos desde el FrontEnd */
            user.username = username;
            user.role = role;
        } catch (e) {
            return res.status(404).json( { message: 'User not found' } );
            // En caso de no encontrarlo entramos al "catch"
        }

        // Comprobamos si existen errores
        const validationOpt = { validationError: { target: false, value: false} }; // Filtrado de errores
        const errors = await validate( user, validationOpt);
        if ( errors.length > 0) {
            return res.status(400).json( errors )
        }

        // Try to save user
        try {
            await userRepository.save( user );
            // Guardamos el usuario en la base de datos
        } catch (e) {
            // En caso de que falle el guardado
            return res.status(409).json( { message: 'Username already in use' } );
        }
        
            res.status(201).json( { message: 'User update' } );
            // Mensaje enviado en caso de que el usuario haya sido modificado
    };

    static deleteUser = async (req: Request, res:Response) => {
        const {id} = req.params;
        const userRepository = getRepository( User );
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (e) {
            return res.status(404).json( { message: 'User not found' } );
        }

        // Remove user
        userRepository.delete(id);
        res.status(201).json( { message: 'User deleted' } );
    };
}

export default UserController;