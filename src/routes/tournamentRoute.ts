import { TournamentController } from "../controllers/tournamentController";

/**
 * tournamentRoute
 * @author Duglas Moreno <duglasoswaldomoreno@gmail.com>
 * @copyright dmoreno.com
 */



/**
 * Carga el controlador
 */

 const tournamentController = new TournamentController();
/**
 * Habilita el Router
 */
 const TournamentRouter: any = tournamentController.router();

 /**
 * Obtiene Experiencias por usuario
 * @route /v1/tournament/index
 * @method get
 */

  TournamentRouter.get("/",tournamentController.getIndex);
  
  module.exports = TournamentRouter;