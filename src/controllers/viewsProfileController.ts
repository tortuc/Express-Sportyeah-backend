import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import ViewsProfile from "../models/viewsProfile";
import { ViewsProfileFilter } from "../helpers/viewsProfileFilter";
/**
 * ViewsProfileController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */

export class ViewsProfileController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Cuando el usuario entre en su pefil privado
   *
   * @param request
   * @param response
   */
  public createProfileView(request: Request, response: Response) {
    // verifica si existe un ViewsProfile para este usuario
    ViewsProfile.createProfileView(request.body)
      .then((views) => {
        response.status(HttpResponse.Ok).json(views);
      })
      .catch((err) => {
        console.log(err);

        response.status(HttpResponse.BadRequest).json(err);
      });
  }

  /**
   * Cuando el usuario entre en su pefil privado
   *
   * @param request
   * @param response
   */
  public getProfileView(request: Request, response: Response) {
    let view = request.body.view;
    // verifica si existe un ViewsProfile para este usuario
    ViewsProfile.getProfileView(request.params.id)
      .then((views) => {
        response.status(HttpResponse.Ok).json(views);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).json(err);
      });
  }

  /**
   * Retorna la cantidad de visitas al perfil en una semana
   * @param request
   * @param response
   */
  public async getVisitsByWeek(request: Request, response: Response) {
    let { date, id, from } = request.params;

    try {
      let events = await ViewsProfileFilter.getUserViewsCount(date, id, from);
      response.status(HttpResponse.Ok).json(events);
    } catch (error) {
      console.log(error);

      response.status(HttpResponse.BadRequest).send(error);
    }
  }
}
