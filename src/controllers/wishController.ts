import { Request, Response } from "express";
import { HttpResponse } from "../helpers/httpResponse";
import { OpenGraph } from "../helpers/openGraph";
import { BaseController } from "./baseController";

/**
 * WishController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class WishController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Obtiene informacion de una pagina a traves de un link que se le pasa, con open Graph
   */

  public async openGraph(request: Request, response: Response) {
    let url = request.body.url;
    OpenGraph.pageInfo(url)
      .then((data) => {
        response.status(HttpResponse.Ok).json(data);
      })
      .catch((err) => {
        response.status(HttpResponse.Unauthorized).send("cannot read info");
      });
  }
}
