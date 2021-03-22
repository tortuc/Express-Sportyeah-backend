import { Request, Response } from "express";
import { HttpResponse } from "../helpers/httpResponse";
import Aptitude from "../models/aptitude";
import { BaseController } from "./baseController";

/**
 *  AptitudeController
 *
 * Explica el objeto de este controlador
 *
 * @author David Valor <davidvalorwork@gmail.com>
 * @copyright Sapviremoto
 */

export class AptitudeController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Obtener experiencia por usuario
   */
  public getAptitudeByUser(request: Request, response: Response) {
    Aptitude.getAptitudesByUser(request.params.id)
      .then((aptitudes: any[]) => {
        response.status(HttpResponse.Ok).json(aptitudes);
      })
      .catch((err) => {
        console.log(err);
        response
          .status(HttpResponse.BadRequest)
          .send("cannot get aptitude");
      });
  }

  /**
   * Crear una experiencia
   */
  public create(request: Request, response: Response) {
    let aptitude = request.body;
    let user = request.body.decoded.id;
    aptitude.user = user;
    delete aptitude.decoded;
    Aptitude.newAptitudes(aptitude)
      .then((aptitude) => {
        response.status(HttpResponse.Ok).json(aptitude);
      })
      .catch((err) => {
        console.log(err);
        response
          .status(HttpResponse.BadRequest)
          .send("cannot create aptitude");
      });
  }

  /**
   * Borra o elimina una experiencia
   * @param request
   * @param response
   */
  public delete(request: Request, response: Response) {
    let id = request.params.id;
    Aptitude.deleteAptitudes(id)
      .then((aptitude) => {
        response.status(HttpResponse.Ok).json({ delete: true });
      })
      .catch((err) => {
        response
          .status(HttpResponse.BadRequest)
          .send("cannot delete aptitude");
      });
  }

  /**
   * Edita una experiencia
   */

  public edit(request: Request, response: Response) {
    let id = request.params.id;
    let newValues = request.body;
    delete newValues.decoded;
    Aptitude.updateAptitudes(id, newValues)
      .then((aptitude) => {
        response.status(HttpResponse.Ok).json(aptitude);
      })
      .catch((err) => {
        console.log(err);
        response.status(HttpResponse.BadRequest).send("cannot edit aptitude");
      });
  }
}
