import { LandingController } from "../controllers/landingController";
import { Authentication } from "./middleware/authentication";
/**
 * Landing Route
 *
 * @author David V <davidvalorwork@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const landingController = new LandingController();

/**
 * Habilita el Router
 */
const landingRouter: any = landingController.router();

/**
 * Obtiene todos los ionic icons
 * @route /v1/landing/icons
 * @method get
 */
landingRouter.get("/ionicIcons", landingController.iconsIonic);

/**
 * Obtiene Landing por usuario
 * @method post
 * @route /v1/landing/:id
 */

landingRouter.get("/:id", landingController.getLandingByUser);

/**
 * Crea una landing
 * @method post
 * @route /v1/landing/create
 */

landingRouter.post("/create", Authentication.jwt, landingController.create);

/**
 * Edita una landing
 * @route /v1/landing/edit/:id
 * @method put
 */

landingRouter.put("/edit/:id", Authentication.jwt, landingController.edit);

module.exports = landingRouter;
