import { AptitudeController } from "../controllers/aptitudeController";
import { Authentication } from "./middleware/authentication";
/**
 * exampleRoute
 *
 * @author David V <davidvalorwork@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const aptitudeController = new AptitudeController();

/**
 * Habilita el Router
 */
const aptitudeRouter: any = aptitudeController.router();

/**
 * Obtiene Experiencias por usuario
 * @method post
 * @route /v1/aptitude/:id
 */

aptitudeRouter.get(
  "/:id",
  Authentication.jwt,
  aptitudeController.getAptitudeByUser
);


/**
 * Crea una experiencia
 * @method post
 * @route /v1/aptitude/create
 */

aptitudeRouter.post(
  "/create",
  Authentication.jwt,
  aptitudeController.create
);

/**
 * eliminar una experiencia
 * @route /v1/aptitude/delete/:id
 * @method delete
 */

aptitudeRouter.delete(
  "/delete/:id",
  Authentication.jwt,
  aptitudeController.delete
);

/**
 * Edita una experiencia
 * @route /v1/aptitude/edit/:id
 * @method put
 */

aptitudeRouter.put(
  "/edit/:id",
  Authentication.jwt,
  aptitudeController.edit
);

module.exports = aptitudeRouter;
