/**
 * App
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */

import * as express from "express";
import * as body_parser from "body-parser";
import * as cors from "cors";

import { Environment } from "./environment";
import { Config } from "./config";
import { Router } from "../routes/router";
import { Mongoose } from "./mongoose";
import { Socket } from "./socket";
import { UserController } from "../controllers/userController";

export class App {
  /**
   * Instancia única de esta clase
   * Es un Singleton
   */
  private static instance: App = null;

  /**
   * La aplicación
   */
  public app: express.Express;

  /**
   * El constructor es privado
   */
  private constructor() {
    // Iniciamos el Framework express
    this.app = express();

    this.config();
  }

  /**
   * Configura la aplicación
   *
   * @param {void}
   */
  private config(): void {
    // Usamos el body parser
    this.app.use(
      express.urlencoded({
        extended: false,
      })
    );

    this.app.use(express.json());

    // Usamos CORS
    this.app.use(cors({origin:['http://localhost:4200','https://app.sportyeah.com','https://www.sportyeah.com','http://localhost:8100']}));
  }

  /**
   * Inicia el servidor
   *
   * @return {Promise}
   */
  private startServer(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Obtiene la dirección ip del servidor
      let ip = require("ip").address();

      //
      // Carga los certificados de seguridad SSL de Let's Encrypt
      //

      let fs = require("fs");

      // El momento actual
      let moment: string = new Date().toLocaleTimeString();

      // El servidor
      let server: any = null;

      // En desarrollo se puede lanzar un servidor no seguro
      server = require("http")
        .createServer(this.app)
        .listen(Config.get("app.port"), () => {
          console.info(
            `[OK] ${moment} Servidor de ${Environment.get()} configurado. Dirección ip: ${ip}`
          );

          resolve(server);
        })
        .on("error", (error: { errno: string }) => {
          if (error.errno === "EADDRINUSE") {
            process.exit();
          } else {
            console.error(`[ERROR] ${error}`);
            process.exit();
          }
        });
    });
  }

  /**
   * Rutas de la aplicación
   *
   * @return {Router}
   */
  private route(): Router {
    // Inicia el router
    return new Router(this.app);
  }

  /**
   * Obtiene la aplicación actual
   *
   * @return {App}
   */
  public static get(): App {
    if (!App.instance) {
      App.instance = new App();
    }

    return App.instance;
  }

  /**
   * Ejecuta la aplicación
   *
   * @return {void}
   */
  public static run(): void {
    // Obtiene la aplicación
    let application: App = App.get();

    // El momento actual
    let moment: string = new Date().toLocaleTimeString();

    console.info(
      `[OK] ${moment} Aplicación ${Config.get("app.name")} ${Config.get(
        "app.version"
      )} iniciada. Escuchando peticiones en el puerto ${Config.get("app.port")}`
    );

    // Inicia el servidor
    application.startServer().then((server) => {
      // Aqui llamamos al socket y le pasamos el server que se acaba de crear
      Socket.init(server);

      // retorna el servidor creado

      // Carga las rutas de la aplicación
      application.route();

      console.info(`[OK] ${moment} Las rutas han sido cargadas con éxito`);

      // Inicia la conexión a Mongo
      Mongoose.startConnection();

      // Configura el motor de plantillas
      application.setupTemplateEngine();
    });
  }

  /**
   * Configura el motor de plantillas
   *
   * @return {void}
   */
  private setupTemplateEngine(): void {
    const engine: string = Config.get("views.engine");

    switch (engine) {
      case "hbs":
        this.setupHbsTemplateEngine();
        break;
      default:
        // El momento actual
        let moment: string = new Date().toLocaleTimeString();

        throw `[ERROR] ${moment} El motor de plantillas especificado ${engine} no es válido`;
    }
  }

  /**
   * Configura el motor de plantillas handlebars (hbs)
   *
   * @link https://handlebarsjs.com/guide/#what-is-handlebars
   */
  private setupHbsTemplateEngine(): void {
    // La carpeta que contiene las vistas
    const viewsFolder: string = require("path").resolve(
      `${__dirname}/../${Config.get("views.hbs.folder")}`
    );

    // La carpeta que contiene las vistas
    const partialsFolder: string = Config.get("views.hbs.partials");

    // El layout por defecto
    const defaultLayout: any = Config.get("views.hbs.defaultLayout");

    // La extensión que se usa para las vistas
    const viewsExtension: string = Config.get("views.hbs.extension");

    // Carga express-handlebars
    // @link https://www.npmjs.com/package/express-hbs
    const hbs = require("express-handlebars");

    const handlebars = hbs.create({
      partialsDir: `${viewsFolder}/${partialsFolder}`,
      defaultLayout: defaultLayout,
      extname: viewsExtension,
    });

    this.app.engine(viewsExtension, handlebars.engine);

    // Fija la carpeta que contiene las vistas
    this.app.set("views", viewsFolder);

    // Fija la extensión de las vistas
    this.app.set("view engine", viewsExtension);
  }
}
