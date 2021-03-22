import { ViewsProfileController } from '../controllers/viewsProfileController';

/**
 * exampleRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */

/**
 * Carga el controlador
 */
const viewsProfileController = new ViewsProfileController();

/**
 * Habilita el Router
 */
const viewsProfileRouter:any = viewsProfileController.router();



/**
 * Esta trae las vista al perfil de un usuario
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsProfile/:id
 * @method get
 */
viewsProfileRouter.get('/:id', viewsProfileController.getProfileView);


/**
 * Esta introduce a un usuario que miro un perfil
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsProfile/update
 * @method post
 */
viewsProfileRouter.post('/update', viewsProfileController.updateProfileView);

module.exports = viewsProfileRouter;
