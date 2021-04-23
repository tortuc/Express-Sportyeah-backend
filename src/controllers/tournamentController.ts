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
  
 } 