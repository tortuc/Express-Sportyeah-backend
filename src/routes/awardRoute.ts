import { AwardController } from "../controllers/awardController";
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
const awardController = new AwardController();

/**
 * Habilita el Router
 */
const awardRouter: any = awardController.router();

/**
 * Obtiene Experiencias por usuario
 * @method post
 * @route /v1/award/:id
 */

awardRouter.get(
  "/:id",
  Authentication.jwt,
  awardController.getAwardByUser
);


/**
 * Crea una experiencia
 * @method post
 * @route /v1/award/create
 */

awardRouter.post(
  "/create",
  Authentication.jwt,
  awardController.create
);

/**
 * eliminar una experiencia
 * @route /v1/award/delete/:id
 * @method delete
 */

awardRouter.delete(
  "/delete/:id",
  Authentication.jwt,
  awardController.delete
);

/**
 * Edita una experiencia
 * @route /v1/award/edit/:id
 * @method put
 */

awardRouter.put(
  "/edit/:id",
  Authentication.jwt,
  awardController.edit
);

module.exports = awardRouter;
