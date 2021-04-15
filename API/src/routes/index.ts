// Importaciones
import { Router } from 'express';

import auth from './auth';
import user from './user';

// constante con las rutas, instancia de Router
const routes = Router();

// Rutas. Colocamos el prefijo que lo relaciona con la impotación
routes.use( '/auth', auth );
routes.use( '/users', user );

// Realizamos la exportación de la ruta
export default routes;