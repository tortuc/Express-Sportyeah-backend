import { StructureController } from "../controllers/structureController";
/**
 * StructureRoute
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const structureController = new StructureController();

/**
 * Habilita el Router
 */
const StructureRouter: any = structureController.router();

// ----------------------------------------------
// --------------CRUD STRUCTURE  ----------------
// ----------------------------------------------

/**
 * Obtiene la estructura de un perfil (usuario)
 *
 * @route /v1/structure/getbyuser/:id
 * @method get
 */
StructureRouter.get("/getbyuser/:id", structureController.getStructureByUser);

/**
 * Edita la estructura de un perfil (usuario)
 *
 * @route /v1/structure/update/:id
 * @method put
 */
StructureRouter.put("/update/:id", structureController.updateStructureById);
// ----------------------------------------------
// --------------FIN CRUD ESTRUCTURA ------------
// ----------------------------------------------

// ----------------------------------------------
// --------------CRUD ORGANIGRAMA----------------
// ----------------------------------------------

/**
 * Crea un perfil para un organigrama
 * @method post
 * @route /v1/structure/organization/create
 */

StructureRouter.post(
  "/organization/create",
  structureController.createOrganizationProfile
);

/**
 * Obtiene el organigrama (todos los perfiles) de una estructura
 * @route /v1/structure/organization/bystructure/:id
 * @method get
 */

StructureRouter.get(
  "/organization/bystructure/:id",
  structureController.getOrganizationChartByStructure
);
/**
 * Obtiene  la informacion de un perfil del organigrama
 * @route /v1/structure/organization/getone/:id
 * @method get
 */

StructureRouter.get(
  "/organization/getone/:id",
  structureController.getInfoProfileOrganizationById
);

/**
 * Modifica un perfil del organigrama
 *
 * @route /v1/structure/organization/update/:id
 * @method put
 */

StructureRouter.put(
  "/organization/update/:id",
  structureController.updateProfileOrganizationById
);

/**
 * Elimina un perfil del organigrama
 *
 * @route /v1/structure/organization/delete/:id
 * @method delete
 */

StructureRouter.delete(
  "/organization/delete/:id",
  structureController.deleteProfileOrganization
);
// ----------------------------------------------
// --------------FIN CRUD ORGANIGRAMA------------
// ----------------------------------------------

module.exports = StructureRouter;
