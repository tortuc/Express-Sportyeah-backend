import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import { Alert } from "../helpers/alert";
import Tournament from '../models/tournament';
 



/**
 * TournamentController
 * 
 * Controlador para Proceso del Torneo
 *  
 * @author Duglas Moreno <duglasoswaldomoreno@gmail.com>
 * @copyright dmoreno.com
 */
 
 export class TournamentController extends BaseController
 {
 /**
* El constructor
*/
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

/**
   * Crear un Post
   *
   * @route /v1/tournament/index
   * @method get
*/

  public getIndex(request:Request,response: Response){
   
    Tournament.getAll().then((resp) => {
        response.status(HttpResponse.Ok).json(resp); 
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("error-consulta");
      });
  }
  
   
  public create(request: Request, response: Response) {
    let data = request.body;
    Tournament.create(data)
      .then((datos) => {
        response.status(HttpResponse.Ok).json(datos);
      })
      .catch((err) => {
        console.log(err);
        response
          .status(HttpResponse.BadRequest)
          .send("cannot create Tournament");
      });
  }
  
  public getById(request: Request, response: Response) {
    Tournament.findById(request.params.id)
      .then((tournamentData) => {
        response.status(HttpResponse.Ok).json(tournamentData);
      })
      .catch((err) => {
        response
          .status(HttpResponse.BadRequest)
          .send("cannot get tournament Data");
      });
  }


  public update(request: Request, response: Response) {
    let id = request.params.id;
    let newValues = request.body;
 
    Tournament.update(id, newValues)
      .then((data) => {
        response.status(HttpResponse.Ok).json(data);
      })
      .catch((err) => {
        console.log(err);
        response.status(HttpResponse.BadRequest).send("cannot edit tournament");
      });
  } 

  
 } 