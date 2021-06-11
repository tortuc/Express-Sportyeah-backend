import { Request, Response } from "express";
import { HttpResponse } from "../helpers/httpResponse";
import Landing from "../models/landing";
import { BaseController } from "./baseController";
import * as fs from "fs";
import * as path from "path";

/**
 *  Landings Controller
 *
 * Explica el objeto de este controlador
 *
 * @author David Valor <davidvalorwork@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class LandingController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Obtener landing por usuario
   */
  public getLandingByUser(request: Request, response: Response) {
    Landing.findByLandingId(request.params.id)
      .then((landings) => {
        response.status(HttpResponse.Ok).json(landings);
      })
      .catch((err) => {
        console.log(err);
        response.status(HttpResponse.BadRequest).send("cannot get landing");
      });
  }

  /**
   * Crear una landing
   */
  public create(request: Request, response: Response) {
    let landing = request.body;
    Landing.create(landing)
      .then((landing) => {
        response.status(HttpResponse.Ok).json(landing);
      })
      .catch((err) => {
        console.log(err);
        response.status(HttpResponse.BadRequest).send("cannot create landing");
      });
  }

  /**
   * Edita una landing
   */
  public edit(request: Request, response: Response) {
    let id = request.params.id;
    let newValues = request.body;
    Landing.updateOne(id, newValues)
      .then((landing) => {
        response.status(HttpResponse.Ok).json(landing);
      })
      .catch((err) => {
        console.log(err);
        response.status(HttpResponse.BadRequest).send("cannot edit landing");
      });
  }

  public iconsIonic(req: Request, res: Response) {
    fs.readdir(
      path.resolve(__dirname + "/../assets/ionic_icons"),
      (err, filenames) => {
        if (err) res.status(HttpResponse.BadRequest).send(err);
        filenames = filenames.map((file: string) => file.replace(".svg", ""));
        res.status(HttpResponse.Ok).send(filenames);
      }
    );
  }
}
