import { CategorytournamentController } from "../controllers/categorytournamentController";



/**
 * tournamentRoute
 * @author Duglas Moreno <duglasoswaldomoreno@gmail.com>
 * @copyright dmoreno.com
 */



/**
 * Carga el controlador
 */

 const categorytournamentController = new CategorytournamentController();
/**
 * Habilita el Router
 */
 const CategoryTournamenRoute: any = categorytournamentController.router();

 /**
 * Obtiene Experiencias por usuario
 * @route /v1/tournament/index
 * @method get
 */

  CategoryTournamenRoute.get("/",categorytournamentController.getAll);
  CategoryTournamenRoute.post('/create', categorytournamentController.create);
  CategoryTournamenRoute.get("/:id",categorytournamentController.getAllById);
  CategoryTournamenRoute.put("/update/:id",categorytournamentController.edit);
  CategoryTournamenRoute.get("/delete/:id",categorytournamentController.delete);

  
  
  module.exports = CategoryTournamenRoute;