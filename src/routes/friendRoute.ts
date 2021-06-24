import { FriendController } from '../controllers/friendController';
import { Authentication } from './middleware/authentication';

/**
 * friendRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
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
friendRoute.get('/followings',Authentication.jwt, friendController.following);
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

/**
 * Buscar usuarios query
 *
 * @route /v1/friend/query/:query
 * @method get
 */
 friendRoute.get(
    "/query/:query",
    friendController.searchUserQuery
  );
  /**
   * Buscar usuarios por nombre... con skip
   *
   * @route /v1/friend/query/:query
   * @method get
   */
  friendRoute.put(
    "/query/:query/:skip",
    friendController.searchUserQuerySkip
  );

module.exports = friendRoute;
