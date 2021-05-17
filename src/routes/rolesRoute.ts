import { RolesController } from "../controllers/rolesController";

/**
 * RolesRoute
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

/**
 * Carga el controlador
 */
const rolesController = new RolesController();

/**
 * Habilita el Router
 */
const RolesRouter: any = rolesController.router();

/**
 *
 * obtiene todos los roles
 * 
 * @route /v1/roles/all
 * @method get
 */
RolesRouter.get("/all", rolesController.getRoles);

/**
 * Crea un nuevo rol
 * @route /v1/roles/create
 * @method post
 */
RolesRouter.post('/create',rolesController.createRole)

/**
 * Modifica un rol existente
 * 
 * @route /v1/roles/all
 * @method put
 */
RolesRouter.put('/update/:id',rolesController.updateRole)

/**
 * Obtener un role
 * 
 * @route /v1/roles/get/:id
 * @method get
 */
RolesRouter.get('/get/:id',rolesController.findOne)

module.exports = RolesRouter;
