import { ExampleController } from '../controllers/_exampleController';
import { WishController } from '../controllers/wishController'
import { Authentication } from './middleware/authentication';
/**
 * exampleRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const wishController = new WishController();

/**
 * Habilita el Router
 */
const WishRouter:any = wishController.router();


/**
 * Obtiene la lista de deseos de un usuario
 * @route /v1/wish/list/:id 
 * @method get
 */

WishRouter.get('/list/:id',Authentication.jwt, wishController.getListByUser);

/**
 * Crea un deseo
 * @method post
 * @route /v1/wish/create
 */

WishRouter.post('/create',Authentication.jwt, wishController.create);

/**
 * Obtiene los deseos por lista
 * @method get
 * @route /v1/wish/bylist/:id
 */

WishRouter.get('/bylist/:id',Authentication.jwt, wishController.getWishesByList);

/**
 * Cambia la privacidad del deseo
 * @route /v1/wish/privacity/:id
 * @method put
 */

WishRouter.put('/privacity/:id',Authentication.jwt,wishController.privacity)

/**
 * eliminar un deseo
 * @route /v1/wish/delete/:id
 * @method delete
 */

WishRouter.delete('/delete/:id',Authentication.jwt,wishController.delete)

/**
 * Cambia el campo `done` del Wish
 * @route /v1/wish/doneundone/:id
 * @method put
 */

WishRouter.put('/doneundone/:id',Authentication.jwt,wishController.dondeUndone)

/**
 * Edita un deseo
 * @route /v1/wish/edit/:id
 * @method put
 */

WishRouter.put('/edit/:id',Authentication.jwt,wishController.edit)


WishRouter.post('/page',wishController.openGraph)

module.exports = WishRouter;
