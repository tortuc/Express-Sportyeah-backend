import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express"; 
import Porratournament from "../models/porra";
 
 



/**
 * PorraController
 * 
 * Controlador para Proceso del Torneo
 *  
 * @author Duglas Moreno <duglasoswaldomoreno@gmail.com>
 * @copyright dmoreno.com
 */
 
 export class PorraController extends BaseController
 {
 /**
* El constructor
*/
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

/**
   *  Visualizar todos las porra del usuario
   *
   * @route /v1/porratournament/index
   * @method get
*/

  public getAll(request:Request,response: Response){
    
    Porratournament.getAll(request.body.decoded.id).then((porratournament)=>{
        response.status(HttpResponse.Ok).json(porratournament)
    })
    .catch((err)=>{
        response.status(HttpResponse.InternalError).send('cannot get porratournament')
    })


  }

 /**
   *  Visualizar una porra
   *
   * @route /v1/porratournament/:id
   * @method get
*/
 

  public getAllById(request: Request, response: Response) {
    Porratournament.findById(request.params.id)
      .then((porratournament) => {
        response.status(HttpResponse.Ok).json(porratournament);
      })
      .catch((err) => {
        response
          .status(HttpResponse.BadRequest)
          .send("cannot get porratournament");
      });
  }



 /**
   *  Crear una porra
   *
   * @route /v1/porratournament/create
   * @method post
*/
 
  public create(request: Request, response: Response) {
    let data = request.body;
    Porratournament.create(data)
      .then((datos) => {
        response.status(HttpResponse.Ok).json(datos);
      })
      .catch((err) => {
        console.log(err);
        response
          .status(HttpResponse.BadRequest)
          .send("cannot create Porratournament");
      });
  } 


  /**
   * Borra o elimina una Porra
   * @param request
   * @route /v1/porratournament/delete
   * @method get
   */
   public delete(request: Request, response: Response) {
    let id = request.params.id;
    Porratournament.delete(id)
      .then((data) => {
        response.status(HttpResponse.Ok).json({ delete: true });
      })
      .catch((err) => {
        response
          .status(HttpResponse.BadRequest)
          .send("cannot delete Category");
      });
  }

  /**
   * Editar una Porra
   * @param request
   * @route /v1/porratournament/:id
   * @method put
   */

  public edit(request: Request, response: Response) {
    let id = request.params.id;
    let newValues = request.body;
 
    Porratournament.update(id, newValues)
      .then((data) => {
        response.status(HttpResponse.Ok).json(data);
      })
      .catch((err) => {
        console.log(err);
        response.status(HttpResponse.BadRequest).send("cannot edit Porra");
      });
  }  
  
 } 