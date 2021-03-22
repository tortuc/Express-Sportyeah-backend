import { ChatController } from '../controllers/chatController';
import { Authentication } from './middleware/authentication';

/**
 * ChatRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */

/**
 * Carga el controlador
 */
const chatController = new ChatController();

/**
 * Habilita el Router
 */
const ChatRouter:any = chatController.router();

/**
 * Crear chat
 * 
 * Crea un chat o devuelve uno si ya existe
 * 
 * @route /v1/chat/create
 * @method post
 */
ChatRouter.post('/create',Authentication.jwt, chatController.create);


/**
 * Retorna todos los chats de un usuario
 * @route /v1/chat/user
 * @method get
 */
ChatRouter.get('/user',Authentication.jwt,chatController.findChats)

module.exports = ChatRouter;
