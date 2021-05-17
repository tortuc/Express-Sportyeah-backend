import { WishController } from "../controllers/wishController";
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
const WishRouter: any = wishController.router();

WishRouter.post("/page", wishController.openGraph);

module.exports = WishRouter;
