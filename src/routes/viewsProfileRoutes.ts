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
 * Esta introduce a un usuario que miro un perfil
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsProfile/create
 * @method post
 */
 viewsProfileRouter.post('/create', viewsProfileController.createProfileView);


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
 * Esta trae las vista al los sponsor de semana
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsSponsor/week/:id/:dateStart
 * @method get
 */
 viewsProfileRouter.get('/week/:id/:date/:from', viewsProfileController.getVisitsByWeek);




module.exports = viewsProfileRouter;
