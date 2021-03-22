import { Request, Response } from "express";
import { HttpResponse } from "../helpers/httpResponse";
import Award from "../models/award";
import { BaseController } from "./baseController";

/**
 *  AwardController
 *
 * Explica el objeto de este controlador
 *
 * @author David Valor <davidvalorwork@gmail.com>
 * @copyright Sapviremoto
 */

export class AwardController extends BaseController {
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
  public getAwardByUser(request: Request, response: Response) {
    Award.getAwardsByUser(request.params.id)
      .then((awards: any[]) => {
        response.status(HttpResponse.Ok).json(awards);
      })
      .catch((err) => {
        console.log(err);
        response
          .status(HttpResponse.BadRequest)
          .send("cannot get award");
      });
  }

  /**
   * Crear una experiencia
   */
  public create(request: Request, response: Response) {
    let award = request.body;
    let user = request.body.decoded.id;
    award.user = user;
    delete award.decoded;
    Award.newAwards(award)
      .then((award) => {
        response.status(HttpResponse.Ok).json(award);
      })
      .catch((err) => {
        console.log(err);
        response
          .status(HttpResponse.BadRequest)
          .send("cannot create award");
      });
  }

  /**
   * Borra o elimina una experiencia
   * @param request
   * @param response
   */
  public delete(request: Request, response: Response) {
    let id = request.params.id;
    Award.deleteAwards(id)
      .then((award) => {
        response.status(HttpResponse.Ok).json({ delete: true });
      })
      .catch((err) => {
        response
          .status(HttpResponse.BadRequest)
          .send("cannot delete award");
      });
  }

  /**
   * Edita una experiencia
   */

  public edit(request: Request, response: Response) {
    let id = request.params.id;
    let newValues = request.body;
    delete newValues.decoded;
    Award.updateAwards(id, newValues)
      .then((award) => {
        response.status(HttpResponse.Ok).json(award);
      })
      .catch((err) => {
        console.log(err);
        response.status(HttpResponse.BadRequest).send("cannot edit award");
      });
  }
}
