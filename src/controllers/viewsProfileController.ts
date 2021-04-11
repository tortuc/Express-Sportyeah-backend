import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import ViewsProfile from "../models/viewsProfile";
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
  console.log('Estoy en el create');
  console.log(request.body);
  
  // verifica si existe un ViewsProfile para este usuario
  ViewsProfile.createProfileView(request.body.view)
    .then((views) => {
      response.status(HttpResponse.Ok).json(views);
    })
    .catch((err) => {
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

  public updateProfileView(request: Request, res: Response) {
    let userVisitor = request.body.visitor;
    let userVisited = request.body.visited;
    let from = request.body.from
    let link = request.body.link
    ViewsProfile.getProfileView(request.body.visited)
      .then((exist) => {
        if (!exist) {
          //Si no existe lo crea
          ViewsProfile.createProfileView({
            user: userVisited,
            visits: [{ 
              user: userVisitor,
              from:from,
              link:link
             }],
          });
          res.status(HttpResponse.Ok).json("true");
        } else {
          //Si existe lo actualiza
          ViewsProfile.updateProfileView(exist._id, userVisitor,from,link)
            .then((response) => {
              res.status(HttpResponse.Ok).json("true");
            })
            .catch((err) => {
              res.status(HttpResponse.BadRequest).json(err);
            });
        }
      })
      .catch((err) => {
        res.status(HttpResponse.BadRequest).json(err);
      });
  }
}
