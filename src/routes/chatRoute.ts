import { ChatController } from '../controllers/chatController';
import { Authentication } from './middleware/authentication';

/**
 * ChatRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
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
 * Crear grupo
 * 
 * Crea un gruppo
 * 
 * @route /v1/chat/create/group
 * @method post
 */
ChatRouter.post('/create/group',Authentication.jwt, chatController.createGroup);


/**
 * Retorna todos los chats de un usuario
 * @route /v1/chat/user
 * @method get
 */
ChatRouter.get('/user',Authentication.jwt,chatController.findChats)

/**
 * dejar un chat grupal
 * 
 * @route /v1/chat/leave/:id
 * @method delete
 */
ChatRouter.delete('/leave/:id',Authentication.jwt,chatController.leaveChat)

/**
 * Obtener un chat por su id
 * 
 * @route /v1/chat/get/:id
 * @method get
 */
ChatRouter.get('/get/:id',chatController.getChat)

/**
 * Obtener lista de grupos publicos (Query optional param)
 * 
 * @route /v1/chat/get/groups
 * @method get
 */

ChatRouter.get('/public/groups', Authentication.jwt, chatController.getPublicGroups)
ChatRouter.get('/public/groups/:query', Authentication.jwt, chatController.getPublicGroups)

/**
 * Editar un chat grupal
 * 
 * @route /v1/chat/edit/:id
 * @method put
 */
ChatRouter.put('/edit/:id',Authentication.jwt,chatController.editChat)

/**
 * Agrega usuarios a un chat grupal
 * 
 * @route /v1/chat/addusers/:id
 * @method put
 */
ChatRouter.put('/addusers/:id',Authentication.jwt,chatController.addUsersToGroup)

/**
 * Expulsar un usuario de un chat grupal
 * 
 * @route /v1/chat/kickuser/:id/:user
 * @method delete
 */
ChatRouter.delete('/kickuser/:id/:user',Authentication.jwt,chatController.kickUserFromGroup)

/**
 * Convertir a un usuario en administrador del grupo
 * 
 * @route /v1/chat/makeadmin/:id
 * @method put
 */
ChatRouter.put('/makeadmin/:id',Authentication.jwt,chatController.makeUserAdmin)
/**
 * Descartar a un usuario como administrador del grupo
 * 
 * @route /v1/chat/discardadmin/:id
 * @method put
 */
ChatRouter.put('/discardadmin/:id',Authentication.jwt,chatController.discardAdmin)
/**
 * Verificar si el usuario actual es admin del grupo
 * 
 * @route /v1/chat/verify/ifIsAdmin/:id
 * @method get
 */
ChatRouter.get('/verify/ifIsAdmin/:id',Authentication.jwt,chatController.verifyIsAdmin)

/**
 * Maneja el Accept/Reject de un usuario a un grupo privado
 * 
 * @route /v1/handle/group-join-request/:id/:action
 * @method post
 */
ChatRouter.post('/handle/group-join-request/:id/:action',Authentication.jwt,chatController.handleGroupJoinRequest)


module.exports = ChatRouter;
