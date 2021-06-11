import { HttpErrorController } from '../controllers/httpErrorController';

/**
 * errorRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */



/**
 * Carga el controlador
 */
const httpErrorController = new HttpErrorController();

/**
 * Habilita el Router
 */
const HttpErrorRouter:any = httpErrorController.router();

/**
 * Error
 * 
 * Muestra un error HTTP
 * 
 * @route /error/:code
 * @method get
 */
HttpErrorRouter.get('/:code', httpErrorController.index);

module.exports = HttpErrorRouter;
