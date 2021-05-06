import { ExperienceController } from "../controllers/experienceController";
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
const experienceController = new ExperienceController();

/**
 * Habilita el Router
 */
const ExperienceRouter: any = experienceController.router();

/**
 * Obtiene Experiencias por usuario
 * @method post
 * @route /v1/experience/:id
 */

ExperienceRouter.get(
  "/:id",
  Authentication.jwt,
  experienceController.getExperienceByUser
);


/**
 * Crea una experiencia
 * @method post
 * @route /v1/experience/create
 */

ExperienceRouter.post(
  "/create",
  Authentication.jwt,
  experienceController.create
);

/**
 * eliminar una experiencia
 * @route /v1/experience/delete/:id
 * @method delete
 */

ExperienceRouter.delete(
  "/delete/:id",
  Authentication.jwt,
  experienceController.delete
);

/**
 * Edita una experiencia
 * @route /v1/experience/edit/:id
 * @method put
 */

ExperienceRouter.put(
  "/edit/:id",
  Authentication.jwt,
  experienceController.edit
);

module.exports = ExperienceRouter;
