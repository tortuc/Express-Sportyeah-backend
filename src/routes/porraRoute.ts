 import { PorraController } from "../controllers/porraController";

/**
 * tournamentRoute
 * @author Duglas Moreno <duglasoswaldomoreno@gmail.com>
 * @copyright dmoreno.com
 */





/**
 * Carga el controlador
 */

 const porraController = new PorraController();
/**
 * Habilita el Router
 */
 const PorraControllerRoute: any = porraController.router();

 /**
 * Obtiene Experiencias por usuario
 * @route /v1/tournament/index
 * @method get
 */

  PorraControllerRoute.get("/",porraController.getAll);
  PorraControllerRoute.post('/create', porraController.create);
  PorraControllerRoute.get("/:id",porraController.getAllById);
  PorraControllerRoute.put("/update/:id",porraController.edit);
  PorraControllerRoute.get("/delete/:id",porraController.delete);

  
  
  module.exports = PorraControllerRoute;