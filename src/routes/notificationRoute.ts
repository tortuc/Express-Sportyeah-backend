import { NotificationController } from '../controllers/notificationControlller';
import { Authentication } from './middleware/authentication';

/**
 * notificationRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */

/**
 * Carga el controlador
 */
const notificationController = new NotificationController();

/**
 * Habilita el Router
 */
const NotificationRouter:any = notificationController.router();

/**
 * 
 * 
 * obtiene todas las notificaciones
 * 
 * @route /v1/notification/getall
 * @method get
 */
NotificationRouter.get('/getall/:skip',Authentication.jwt, notificationController.getNotifications);
/**
 * 
 * 
 * obtiene el numero de notificaciones sin ver
 * 
 * @route /v1/notification/unreads
 * @method get
 */
NotificationRouter.get('/unreads',Authentication.jwt, notificationController.notificationsUnread);
/**
 * 
 * 
 * Marcar una notificacion como vista
 * 
 * @route /v1/notification/read/:id
 * @method put
 */
NotificationRouter.put('/read/:id',Authentication.jwt, notificationController.read);
/**
 * 
 * 
 * Marcar todas  las notificaciones como vista
 * 
 * @route /v1/notification/readall
 * @method put
 */
NotificationRouter.put('/readall',Authentication.jwt, notificationController.readAll);

module.exports = NotificationRouter;
