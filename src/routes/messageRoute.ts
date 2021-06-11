import { MessageController } from '../controllers/messageController';
import { Authentication } from './middleware/authentication';

/**
 * MessageRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const messageController = new MessageController();

/**
 * Habilita el Router
 */
const MessageRouter:any = messageController.router();

/**
 * Guarda un mensaje
 * 
 *
 * 
 * @route /v1/message/save
 * @method post
 */
MessageRouter.post('/save',Authentication.jwt, messageController.saveMessage);

/**
 * Obtiene una cantidad de mensajes de un chat
 * @route /v1/message/chat/:id/:skip
 * @method get
 */
MessageRouter.get('/chat/:id/:skip',Authentication.jwt,messageController.getMessagesByChat)

/**
 * Elimina un mensaje
 * @route /v1/message/:id
 * @method delete
 * 
 */
MessageRouter.delete('/:id',Authentication.jwt,messageController.deleteOne)
/**
 * Marca mensajes como leidos
 * @route /v1/message/read
 * @method put
 * 
 */
MessageRouter.put('/read',Authentication.jwt,messageController.readMessages)


/**
 * Vacia un chat para un usuario en especifico
 * @route /v1/message/clear/:id
 * @method delete
 */

 MessageRouter.delete('/clear/:id',Authentication.jwt,messageController.clearChat)


module.exports = MessageRouter;
