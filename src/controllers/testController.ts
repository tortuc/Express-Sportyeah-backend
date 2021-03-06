import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";

import Test from "../models/test";
import { Environment } from "../helpers/environment";
import { Web } from "../helpers/web";
import { MailController } from "./mailController";
import User from "../models/user";
import { Translate } from "../helpers/translate";
import { Languajes } from "../helpers/languajes";
import { Net } from "../helpers/net";

/**
 * TestController
 *
 * Controlador para testing
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class TestController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Muestra un test
   *
   * @route /v1/tests/test/:name
   *
   * @example
   *
   * GET /v1/tests/test/Pacman
   */
  public get(request: Request, response: Response) {
    // Obtiene el id
    let name: string = request.params.name;

    // El momento actual
    let moment: string = new Date().toLocaleTimeString();

    Test.findByName(name)
      .then((tests: any) => {
        response.send(`[OK] ${moment} se ha obtenido los tests ${tests}`);
      })
      .catch((error: any) => {
        console.error(`[ERROR] ${moment} ${error}`);
      });
  }

  /**
   * Muestra todos los tests
   *
   * @route /v1/tests
   *
   * @example
   *
   * GET /v1/tests
   */
  public all(request: Request, response: Response) {
    response.status(200).json({ env: Environment.get() });
  }

  /**
   * Crea un test
   *
   * @route /v1/tests/new
   *
   * @xample
   *
   * POST /v1/tests/new name='Space Invaders' vendor='Taito' date='1979-01-01' record=184870
   */
  public new(request: Request, response: Response) {
    // Crea un nuevo test
    let test = new Test({
      name: request.body.name, // El nombre
      vendor: request.body.vendor, // El fabricante
      date: new Date(request.body.date), // La fecha de lanzamiento
      record: request.body.record, // La m??xima puntuaci??n conseguida
    });

    // El momento actual
    let moment: string = new Date().toLocaleTimeString();

    // Guarda el test
    test
      .save()
      .then((test) => {
        response.send(`[OK] ${moment} se ha creado un nuevo test`);
      })
      .catch((error) => {
        console.error(`[ERROR] ${moment} ${error}`);
      });
  }

  async emailAdmin(request: Request, response: Response) {
    try {
      const user = await User.findByUsername(request.params.username);
      if (!user) throw new Error("No user");

      let geo = Net.geoIp(Net.ip(request));
      console.log(user)
      MailController.newAccountCreated(user, Web.getUrl(), geo);
      response.status(HttpResponse.Ok).json("Probando correo");
    } catch (error) {
      response
        .status(HttpResponse.BadRequest)
        .send("No existe el usuario, o algo");
    }
  }
  async transalte(request: Request, response: Response) {
    const { text } = request.params;
    const lang = request.params.lang as Languajes;

    let translate = await Translate.get(text, lang);

    response.status(HttpResponse.Ok).json(translate);
  }
}
