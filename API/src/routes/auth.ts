import { Router } from 'express';

import AuthController from '../controller/AuthController';
import { checkJwt } from '../middlewares/jwt';

// Contante con la instancia de nuestro router
const router = Router();

// Ruta de login. Pasamos el AuthController u un método
router.use( '/login', AuthController.login );

// Ruta para el cambio de Password
router.post('/change-password', [checkJwt], AuthController.changePassword);

// Exportación de la ruta
export default router;