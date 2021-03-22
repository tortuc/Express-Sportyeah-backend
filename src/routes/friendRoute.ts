import { FriendController } from '../controllers/friendController';
import { Authentication } from './middleware/authentication';

/**
 * friendRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */

/**
 * Carga el controlador
 */
const friendController = new FriendController();

/**
 * Habilita el Router
 */
const friendRoute:any = friendController.router();

/**
 * 
 * 
 * Obtiene a los seguidores
 * 
 * @route /v1/friend/followers
 * @method get
 */
friendRoute.get('/followers',Authentication.jwt, friendController.followers);
/**
 * 
 * 
 * Obtiene a los siguiendo
 * 
 * @route /v1/friend/followings
 * @method get
 */
/**
 * 
 * 
 * Obtiene a los seguidores por id de usuario
 * 
 * @route /v1/friend/followers/:id
 * @method get
 */
friendRoute.get('/followers/:id',Authentication.jwt, friendController.followersById);
/**
 * 
 * 
 * Obtiene a los siguiendo
 * 
 * @route /v1/friend/followings
 * @method get
 */
friendRoute.get('/followings',Authentication.jwt, friendController.following);
/**
 * 
 * 
 * Obtiene a los siguiendo por id de usuario
 * 
 * @route /v1/friend/followings/:id
 * @method get
 */
friendRoute.get('/followings/:id',Authentication.jwt, friendController.followingById);
/**
 * 
 * 
 * crea un nuevo seguidor (amigo)
 * 
 * @route /v1/friend/follow
 * @method post
 */
friendRoute.post('/follow',Authentication.jwt, friendController.newFollower);
/**
 * dejar de seguir a un usuario
 * 
 * @route /v1/friend/unfollow:id
 * @method delete
 */
friendRoute.delete('/unfollow/:id',Authentication.jwt, friendController.unFollow);

module.exports = friendRoute;
