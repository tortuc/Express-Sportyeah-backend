import * as express from "express";

/**
 * Router
 *
 * Maneja las rutas de la aplicación
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class Router {
  /**
   * El router de express
   */
  protected route: any;

  /**
   * El constructor
   *
   * @param {Express.express} app     La aplicacion express
   */
  public constructor(app: express.Express) {
    this.route = app;

    // Carga las rutas
    this.router();
  }

  /**
   * Rutas principales de la aplicación
   *
   * Llama a los restantes enrutadores
   */
  public router(): void {
    /**
     * Manejador de rutas de errores
     *
     * @route /v1/error/...
     */
    this.route.use("/v1/error", require("./errorRoute"));

    /**
     * Manejador de rutas de tests
     *
     * @route /v1/tests/...
     */
    this.route.use("/v1/tests", require("./testRoute"));

    /**
     * Manejador de rutas de usuarios
     *
     * @route /v1/user/...
     */
    this.route.use("/v1/user", require("./userRoute"));
    /**
     * Manejador de rutas de Posts
     *
     * @route /v1/post/...
     */
    this.route.use("/v1/post", require("./postRoute"));

    /**
     * Manejador de rutas de Friends
     *
     * @route /v1/friend/...
     */
    this.route.use("/v1/friend", require("./friendRoute"));

    /**
     * Manejador de rutas de Chats
     *
     * @route /v1/chat/...
     */
    this.route.use("/v1/chat", require("./chatRoute"));
    /**
     * Manejador de rutas de Messages
     *
     * @route /v1/message/...
     */
    this.route.use("/v1/message", require("./messageRoute"));
    /**
     * Manejador de rutas de Messages
     *
     * @route /v1/notification/...
     */
    this.route.use("/v1/notification", require("./notificationRoute"));
    /**
     * Manejador de rutas de Wish
     *
     * @route /v1/wish/...
     */
    this.route.use("/v1/wish", require("./wishRoute"));
    /**
     * Manejador de rutas de Experiencias
     *
     * @route /v1/experience/...
     */
    this.route.use("/v1/experience", require("./experienceRoute"));
    /**
     * Manejador de rutas de las Vistas
     *
     * @route /v1/viewsProfile/...
     */
    this.route.use("/v1/viewsProfile", require("./viewsProfileRoutes"));
    /**
     * Manejador de rutas de Premios y Reconocimientos
     *
     * @route /v1/award/...
     */
    this.route.use("/v1/award", require("./awardRoute"));
    /**
     * Manejador de rutas de Premios y Reconocimientos
     *
     * @route /v1/aptitude/...
     */
    this.route.use("/v1/aptitude", require("./aptitudeRoute"));
    /**
     * Manejador de rutas de landings para los usuarios Marca, etc.
     *
     * @route /v1/landing/...
     */
    this.route.use("/v1/landing", require("./landingRoute"));
    /**
     * Manejador de rutas de las noticias para los usuarios Prensa.
     *
     * @route /v1/news/...
     */
    this.route.use("/v1/news", require("./newsRoute"));
    /**
     * Manejador de rutas para las funciones y endpoins del ranking
     *
     * @route /v1/ranking/...
     */
    this.route.use("/v1/ranking", require("./rankingRoute"));
    /**
     * Manejador de rutas para las preguntas de post y noticias
     *
     * @route /v1/question/...
     */
     this.route.use("/v1/question", require("./questionRoute"));

    /**
     * Iniciao de rutas para creación del torneo
     * @route /v1/tournament/
    */ 
     this.route.use("/v1/tournament", require("./tournamentRoute"));

     this.route.use("/v1/category/tournament", require("./categorytournamentRoute"));

     this.route.use("/v1/porra/tournament", require("./porraRoute"));   
     
    
     /**
     * Manejador de rutas de las Vistas a los Sponsor
     *
     * @route /v1/viewsSponsor/...
     */
      this.route.use("/v1/viewsSponsor", require("./viewsSponsorRoutes"));
   
    }
}
