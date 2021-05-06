import { Request, Response } from "express";
import { HttpResponse } from "../helpers/httpResponse";
import Experience from "../models/experience";
import { BaseController } from "./baseController";

/**
 *  ExperienceController
 *
 * Explica el objeto de este controlador
 *
 * @author David Valor <davidvalorwork@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class ExperienceController extends BaseController {
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
  public getExperienceByUser(request: Request, response: Response) {
    Experience.getExperienceByUser(request.params.id)
      .then((experiences: any[]) => {
        response.status(HttpResponse.Ok).json(experiences);
      })
      .catch((err) => {
        console.log(err);
        response
          .status(HttpResponse.BadRequest)
          .send("cannot get experience");
      });
  }

  /**
   * Crear una experiencia
   */
  public create(request: Request, response: Response) {
    let experience = request.body;
    let user = request.body.decoded.id;
    experience.user = user;
    delete experience.decoded;
    Experience.newExperience(experience)
      .then((experience) => {
        response.status(HttpResponse.Ok).json(experience);
      })
      .catch((err) => {
        console.log(err);
        response
          .status(HttpResponse.BadRequest)
          .send("cannot create experience");
      });
  }

  /**
   * Borra o elimina una experiencia
   * @param request
   * @param response
   */
  public delete(request: Request, response: Response) {
    let id = request.params.id;
    Experience.deleteExperience(id)
      .then((experience) => {
        response.status(HttpResponse.Ok).json({ delete: true });
      })
      .catch((err) => {
        response
          .status(HttpResponse.BadRequest)
          .send("cannot delete experience");
      });
  }

  /**
   * Edita una experiencia
   */

  public edit(request: Request, response: Response) {
    let id = request.params.id;
    let newValues = request.body;
    delete newValues.decoded;
    Experience.updateExperience(id, newValues)
      .then((experience) => {
        response.status(HttpResponse.Ok).json(experience);
      })
      .catch((err) => {
        console.log(err);
        response.status(HttpResponse.BadRequest).send("cannot edit experience");
      });
  }
}
