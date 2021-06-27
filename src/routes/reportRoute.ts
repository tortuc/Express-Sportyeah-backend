import { ReportController } from '../controllers/reportController';
import { Authentication } from './middleware/authentication';

/**
 * reportRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const reportController = new ReportController();

/**
 * Habilita el Router
 */
const ExampleRouter:any = reportController.router();

/**
 * Obtiene todas las denuncias pendientes
 * 
 * @route /v1/report/all/:skip
 * @method get
 */
ExampleRouter.get('/all/:skip', reportController.getAllReports);
/**
 * Obtiene la informacion de una denuncia
 * 
 * @route /v1/report/one/:id
 * @method get
 */
ExampleRouter.get('/one/:id', reportController.getOne);

/**
 * Crear una denuncia 
 * 
 * @route /v1/report/create
 * @method post
 */
ExampleRouter.post('/create', reportController.createReport);

/**
 * Cerrar una denuncia, sin acciones
 * 
 * @route /v1/report/closeonly/:id
 * @method put
 */
ExampleRouter.delete('/closeonly/:id',Authentication.jwt, reportController.closeOnly);

/**
 * Cerrar una denuncia y elimina el comentario
 * 
 * @route /v1/report/closeanddelete/:id
 * @method delete
 */
ExampleRouter.delete('/closeanddelete/:id',Authentication.jwt, reportController.closeAndDelete);



module.exports = ExampleRouter;
