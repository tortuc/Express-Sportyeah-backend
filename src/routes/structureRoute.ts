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
 * Obtiene la estructura de un perfil (usuario) por el nombre de usuario
 *
 * @route /v1/structure/getbyusername/:username
 * @method get
 */
StructureRouter.get(
  "/getbyusername/:username",
  structureController.getStructureByUsername
);

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
 * Obtiene el organigrama (todos los perfiles) de una estructura, mediante el username del usuario a quien pertenece la estructura
 * @route /v1/structure/organization/byusername/:username
 * @method get
 */

StructureRouter.get(
  "/organization/byusername/:username",
  structureController.getOrganizationChartByUsername
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

// ----------------------------------------------
// -------------- CRUD DIVISION  ----------------
// ----------------------------------------------

/**
 * Crear una division
 * @method post
 * @route /v1/structure/division/create
 */
StructureRouter.post("/division/create", structureController.createDivision);

/**
 * Obtiene todas las divisiones por estructura
 * @method get
 * @route /v1/structure/division/bystructure/:id
 */
StructureRouter.get(
  "/division/bystructure/:id",
  structureController.getAllDivisionByStructure
);

/**
 * Obtiene la informacion de una division por su id
 * @method get
 * @route /v1/structure/division/byid/:id
 */
StructureRouter.get("/division/byid/:id", structureController.getDivisionById);

/**
 * Edita una division por su id
 * @method put
 * @route /v1/structure/division/update/:id
 */
StructureRouter.put(
  "/division/update/:id",
  structureController.updateDivisionById
);
/**
 * Elimina una division por su id
 * @method delete
 * @route /v1/structure/division/delete/:id
 */
StructureRouter.delete(
  "/division/delete/:id",
  structureController.deleteDivisionById
);

// ----------------------------------------------
// --------------FIN CRUD DIVISION   ------------
// ----------------------------------------------

// ----------------------------------------------
// -------------- CRUD CATEGORIA  ---------------
// ----------------------------------------------

/**
 * Crea una categoria para una division
 * @method post
 * @route /v1/structure/category/create
 */
StructureRouter.post("/category/create", structureController.createCategory);
/**
 * Obtiene todas las categorias de una division
 * @method get
 * @route /v1/structure/category/bydivision/:id
 */
StructureRouter.get(
  "/category/bydivision/:id",
  structureController.getAllCategoriesByDivision
);
/**
 * Obtiene la informacion de una categoria
 * @method get
 * @route /v1/structure/category/byid/:id
 */
StructureRouter.get("/category/byid/:id", structureController.getCategoriaById);
/**
 *
 * Edita la informacion de una categoria
 * @method put
 * @route /v1/structure/category/update/:id
 */
StructureRouter.put(
  "/category/update/:id",
  structureController.updateCategoryById
);
/**
 * Elimina una categoria
 * @method delete
 * @route /v1/structure/category/delete/:id
 */
StructureRouter.delete(
  "/category/delete/:id",
  structureController.deleteCategoryById
);

// ----------------------------------------------
// ------------- FIN CRUD CATEGORIA  ------------
// ----------------------------------------------

// ----------------------------------------------
// ---------------- CRUD EQUIPOS  ---------------
// ----------------------------------------------

/**
 * Crea un equipo para una categoria
 * @method post
 * @route /v1/structure/team/create
 */
StructureRouter.post("/team/create", structureController.createTeam);
/**
 * Obtiene todos los equipos, de una categoria
 * @method get
 * @route /v1/structure/team/bycategory/:id
 */
StructureRouter.get(
  "/team/bycategory/:id",
  structureController.getAllTeamsByCategory
);
/**
 * Obtiene la informacion de un equipo
 * @method get
 * @route /v1/structure/team/byid/:id
 */
StructureRouter.get("/team/byid/:id", structureController.getTeamById);
/**
 *
 * Edita la informacion de un equipo
 * @method put
 * @route /v1/structure/team/update/:id
 */
StructureRouter.put("/team/update/:id", structureController.updateTeamById);
/**
 * Elimina un equipo
 * @method delete
 * @route /v1/structure/team/delete/:id
 */
StructureRouter.delete("/team/delete/:id", structureController.deleteTeamById);

// ----------------------------------------------
// ------------- FIN CRUD EQUIPO  ------------
// ----------------------------------------------

// ----------------------------------------------
// ---------------- CRUD JUGADORES  ---------------
// ----------------------------------------------

/**
 * Crea un un jugador para un equipo
 * @method post
 * @route /v1/structure/player/create
 */
StructureRouter.post("/player/create", structureController.createPlayer);
/**
 * Obtiene todos jugadores de un equipo
 * @method get
 * @route /v1/structure/player/byteam/:id
 */
StructureRouter.get(
  "/player/byteam/:id",
  structureController.getAllPlayersByTeam
);
/**
 * Obtiene la informacion de un jugador
 * @method get
 * @route /v1/structure/player/byid/:id
 */
StructureRouter.get("/player/byid/:id", structureController.getPlayerById);
/**
 *
 * Edita la informacion de un jugador
 * @method put
 * @route /v1/structure/player/update/:id
 */
StructureRouter.put("/player/update/:id", structureController.updatePlayerById);
/**
 * Elimina un jugador
 * @method delete
 * @route /v1/structure/player/delete/:id
 */
StructureRouter.delete(
  "/player/delete/:id",
  structureController.deletePlayerById
);

// ----------------------------------------------
// ------------- FIN CRUD EQUIPO  ------------
// ----------------------------------------------

module.exports = StructureRouter;
