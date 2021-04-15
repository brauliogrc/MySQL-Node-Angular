import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/role';

// Contante con la instancia de nuestro router
const router = Router();

/**Nuestra rustas están protegidas y necesitaremos un Token valido para ejecutar las acciones de cada una de estasrutas */
// RUTAS
// Get all users
router.get('/',[checkJwt], UserController.getAll);
// Definimos el token y si todo va bien, se ejecutará lo siguiente (este el motvico del método "next()" en el archivo jwt.ts)

// Get one user
router.get('/:id',[checkJwt], UserController.getById);

// Create new user
router.post('/',[checkJwt, checkRole(['admin'])], UserController.newUser);
// Comparamos además el rol

// Edit user
router.patch('/:id',[checkJwt], UserController.editUser);

// Delete user
router.delete('/:id',[checkJwt], UserController.deleteUser);

/** get, post, patch y delete son metodos HTTP y denotan el comportamiento de la api */

export default router;