import { Request, Response } from "express";
import { HttpResponse } from "../helpers/httpResponse"; 
import Categorytournament from "../models/categorytournament";
import { BaseController } from "./baseController";

/**
 *  CategorytournamentController
 *
 * Explica el objeto de este controlador
 *
 * @author Duglas Moreno <duglasoswaldomoreno@gmail.com>
 * @copyright dmoreno.com
 * 
 */

export class CategorytournamentController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  
  /**
   * Obtener Categoria de Torneo 
   */
   public getAll(request: Request, response: Response) {
    Categorytournament.getAll()
      .then((categorytournament) => {
        response.status(HttpResponse.Ok).json(categorytournament);
      })
      .catch((err) => {
        console.log(err);
        response
          .status(HttpResponse.BadRequest)
          .send("cannot get Category");
      });
  }


  /**
   * Obtener Categoria de Torneo por id
   */
  public getAllById(request: Request, response: Response) {
    Categorytournament.findByCategoryId(request.params.id)
      .then((categorytournament) => {
        response.status(HttpResponse.Ok).json(categorytournament);
      })
      .catch((err) => {
        console.log(err);
        response
          .status(HttpResponse.BadRequest)
          .send("cannot get Category");
      });
  }

  /**
   * Crear una Categoria de Torneo
   */
  public create(request: Request, response: Response) {
    let data = request.body;
    
    Categorytournament.create(data)
      .then((datos) => {
        response.status(HttpResponse.Ok).json(datos);
      })
      .catch((err) => {
        console.log(err);
        response
          .status(HttpResponse.BadRequest)
          .send("cannot create Category");
      });
  }

  /**
   * Borra o elimina una Categoria de Torneo
   * @param request
   * @param response
   */
  public delete(request: Request, response: Response) {
    let id = request.params.id;
    Categorytournament.deleteCategory(id)
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
   * Edita una Categoria de Torneo
   */

  public edit(request: Request, response: Response) {
    let id = request.params.id;
    let newValues = request.body;
    delete newValues.decoded;
    Categorytournament.updateCategorytournament(id, newValues)
      .then((data) => {
        response.status(HttpResponse.Ok).json(data);
      })
      .catch((err) => {
        console.log(err);
        response.status(HttpResponse.BadRequest).send("cannot edit Category");
      });
  }
}
