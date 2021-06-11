import { ViewsSponsorController } from '../controllers/viewsSponsorController ';

/**
 * exampleRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const viewsSponsorController = new ViewsSponsorController();

/**
 * Habilita el Router
 */
const viewsSponsorRouter:any = viewsSponsorController.router();


/**
 * Esta introduce a un usuario que miro un perfil
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsProfile/create
 * @method post
 */
 viewsSponsorRouter.post('/create', viewsSponsorController.createSponsorView);


/**
 * Esta trae las vista al los sponsor de un usuario
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsSponsor/:id
 * @method get
 */
viewsSponsorRouter.get('/:id', viewsSponsorController.getSponsorView);

/**
 * Esta trae las vista al los sponsor de un usuario por fecha
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsSponsor/:id/:dateStart/:dateEnd
 * @method get
 */
 viewsSponsorRouter.get('/byTime/:id/:dateStart/:dateEnd', viewsSponsorController.getPostViewsByTime);


/**
 * Esta trae las vista al los sponsor de un usuario por dia
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsSponsor/day/:id/:dateStart/:dateEnd
 * @method get
 */
 viewsSponsorRouter.get('/day/:id/:dateStart/:dateEnd', viewsSponsorController.getPostViewsByDay);


/**
 * Esta trae las vista al los sponsor de semana
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsSponsor/week/:id/:dateStart
 * @method get
 */
 viewsSponsorRouter.get('/week/:id/:date/:from/:name', viewsSponsorController.getVisitsByWeek);

 /**
 * Esta trae las vista al los sponsor de semana
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsSponsor/month/:id/:dateStart
 * @method get
 */
  viewsSponsorRouter.get('/month/:id/:date/:from/:name', viewsSponsorController.getVisitsByMonth);

 /**
 * Esta trae las vista al los sponsor de semana
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsSponsor/year/:id/:dateStart
 * @method get
 */
  viewsSponsorRouter.get('/year/:id/:date/:from/:name', viewsSponsorController.getVisitsByYear);

 /**
 * Esta trae las vista al los sponsor de semana
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsSponsor/year/:id/:dateStart
 * @method get
 */
  viewsSponsorRouter.get('/hour/:id/:date/:from/:name', viewsSponsorController.getVisitsByHour);


  /**
 * Esta trae los datos necesarios para el pdf , datos por mes de cada sponsor
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsSponsor/pdfyear/:id/:date/:name
 * @method get
 */
   viewsSponsorRouter.get('/pdfyear/:id/:date/:name', viewsSponsorController.getVisitsByYearPdf);

  

/**
 * Esta introduce a un usuario que miro un perfil
 * 
 * Ruta por defecto
 * 
 * @route /v1/viewsProfile/update
 * @method post
 */
// viewsProfileRouter.post('/update', viewsSponsorController.updateProfileView);

module.exports = viewsSponsorRouter;
