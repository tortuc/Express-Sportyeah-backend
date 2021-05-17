import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import { Socket } from "../helpers/socket";
import AnalyticLanding from "../models/analyticsLanding";
import User from "../models/user";
import { Analytic } from "../helpers/analytic";
import AnalyticExternalShared from "../models/analyticsExternalShared";
// import AnalyticsEvent from "../models/analyticsEvents";
// import Event from "../models/event";
import Friend from "../models/friend";
import AnalyticProfile from "../models/analyticsProfile";
import Post from "../models/post";
import AnalyticStore from "../models/analyticsStores";
// import AnalyticTodoListView from "../models/analyticsTodoListView";
// import AnalyticListGiftView from "../models/analyticsListGiftView";
// import AnalyticGiverTodoList from "../models/analyticsGiverTodoList";
import { PostFilter } from "../helpers/postFilter";

/**
 * AnalyticsController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class AnalyticsController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();

    this.loadSocket();
  }

  /**
   * Esta funcion carga al socket, y escucha los eventos para las analiticas
   */

  loadSocket() {
    Socket.IO.on("connection", (socket) => {
      socket.on("visit_profile", (data) => {
        AnalyticProfile.addVisit(data.profile, data.visitor).then();
      });

      /**
       * Este socket (evento) sirve para guardar desde la landing page, las visitas y las redirecciones
       */

      socket.on("landing", async (option) => {
        switch (option) {
          case "visit":
            AnalyticLanding.addVisit().then();
            break;

          case "login":
            AnalyticLanding.addLogin().then();
            break;

          case "signup":
            AnalyticLanding.addSignup().then();
            break;

          default:
            break;
        }
      });

      /**
       * Este evento, es para guardar en las analiticas, desde donde se clickeo a las tiendas de apps
       */
      socket.on("click-on-store", (data) => {
        console.log(data);
        switch (data.place) {
          case "gift-list":
            AnalyticStore.giftlist(data.type).then();
            break;
          case "profile":
            AnalyticStore.profile(data.type).then();
            break;
          case "post":
            AnalyticStore.post(data.type).then();
            break;
          case "login":
            AnalyticStore.login(data.type).then();
            break;
          case "landing":
            AnalyticStore.landing(data.type).then();
            break;
          case "event":
            AnalyticStore.event(data.type).then();
            break;
          case "verification":
            AnalyticStore.verification(data.type).then();
            break;

          default:
            break;
        }
      });

      /**
       * Este evento escucha cuando alguien comparte un enlace al exterior, y desde que medio se hizo
       */

      socket.on("shared", (option) => {
        switch (option) {
          case "mobile":
            AnalyticExternalShared.addMobile().then();
            break;
          case "facebook":
            AnalyticExternalShared.addFacebook().then();
            break;
          case "twitter":
            AnalyticExternalShared.addTwitter().then();
            break;

          case "whatsapp":
            AnalyticExternalShared.addWhatsapp().then();
            break;
          case "copy":
            AnalyticExternalShared.addCopy().then();
            break;
          case "linkedin":
            AnalyticExternalShared.addLinkedin().then();
            break;

          default:
            break;
        }
      });

      /**
       * Este evento es para cuando alguien abre un regalo o actividad en la lista de regalos compartidas al exterior
       */

      // socket.on("click_todo", (data) => {
      //   AnalyticTodoListView.addVisit(data.todo, data.visitor).then();
      // });

      /**
       * Este evento es para cuando alguien sale de la lista de regalos compartidas al exterior
       */

      // socket.on("out_list", (data) => {
      //   AnalyticListGiftView.outList(data).then();
      // });

      /**
       * Este evento escucha cuando alguien entra a un lista de regalos en el exterior
       */

      // socket.on("in_list", (data) => {
      //   AnalyticListGiftView.addVisit(data.list, data.user).then((visit) => {
      //     if (visit.visitor == null) {
      //       setTimeout(() => {
      //         AnalyticListGiftView.findByIdAndUpdate(visit._id, {
      //           current: false,
      //         }).then();
      //       }, 1000 * 60);
      //     }
      //   });
      // });

      // /**
      //  * Este evento registra cuando alguien indica que se hara cargo de un regalo o actividad en la lista al exterior
      //  */

      // socket.on("record_todo_giver", (data) => {
      //   AnalyticGiverTodoList.saveRecord(data).then();
      // });
    });
  }

  /**
   * Retorna, la analitica de la landing page, para saber las cantidades de visitas, y redirecciones
   */

  public getDataLanding(request: Request, response: Response) {
    AnalyticLanding.getData()
      .then((data) => {
        console.log("esta es la data landing",data);
        
        let landing = data[0];
        response.status(HttpResponse.Ok).json(landing);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot get data");
      });
  }

  /**
   * Retorna la analitica de los enlaces compartido al exterior (otras redes sociales)
   */
  public getDataExternalShared(request: Request, response: Response) {
    AnalyticExternalShared.getData()
      .then((data) => {
        let external = data[0];
        response.status(HttpResponse.Ok).json(external);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot get data");
      });
  }

  /**
   * Obtiene la cantidad de registros en una semana
   * La semana se determina dependinedo de la fecha que le pasen la fecha debe estar en formato YYYY-MM-DD
   */
  public async getLastSignup(request: Request, response: Response) {
    let date = request.params.date; // format YYYY-MM-DD
    let users = await Analytic.signupsInWeek(date);
    response.status(HttpResponse.Ok).json(users);
  }

  /**
   * Obtiene la cantidad de eventos creados en una semana
   * La semana se determina dependinedo de la fecha que le pasen la fecha debe estar en formato YYYY-MM-DD
   */
  // public async getLastEvents(request: Request, response: Response) {
  //   let date = request.params.date; // format YYYY-MM-DD
  //   try {
  //     let events = await Analytic.eventsInWeek(date);
  //     response.status(HttpResponse.Ok).json(events);
  //   } catch (error) {
  //     response.status(HttpResponse.BadRequest).send(error);
  //   }
  // }

  /**
   * Esta funcion retorna la analitica de los usuarios, total de usuarios, usuarios online, usuarios offline
   * @param request
   * @param response
   */

  public async totalUsers(request: Request, response: Response) {
    let data = await Analytic.usersOnlines();
    response.status(HttpResponse.Ok).json(data);
  }

  /**
   * Retorna el evento mas visitado
   */

  // public eventMosVisited(request: Request, response: Response) {
  //   AnalyticsEvent.mostVisited()
  //     .then(async (analitics) => {
  //       let analitic = analitics[0];
  //       Event.getEventByAnalyticId(analitic._id).then((event) => {
  //         let result = {
  //           visits: analitic.visits,
  //           event,
  //         };
  //         response.status(HttpResponse.Ok).json(result);
  //       });
  //     })
  //     .catch((err) => {
  //       response.status(HttpResponse.BadRequest).send("cannot get event");
  //     });
  // }

  /**
   * Retorna el usuario con mas seguidores en kecuki
   */

  public mostPopularUser(request: Request, response: Response) {
    Friend.mostPopularUser()
      .then((analytics) => {
        User.populate(analytics, { path: "_id" }).then((users) => {
          console.log(users);

          let user = users[0];
          response.status(HttpResponse.Ok).json(user);
        });
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot get user");
      });
  }

  /**
   * Retorna las ultimas visitas a un perfil
   */

  public VisitsToMyProfile(request: Request, response: Response) {
    let id = request.body.decoded.id;
    AnalyticProfile.getVisits(id)
      .then((visitors) => {
        response.status(HttpResponse.Ok).send(visitors);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot get visitors");
      });
  }

  /**
   * Retorna la analitica de un perfil, cantidad de post, cantidad de vistas
   */

  public async getAnaliticProfile(request: Request, response: Response) {
    try {
      let analitic = {
        reactions: await PostFilter.getCountPostReaction(
          request.body.decoded.id
        ),
        visits: await AnalyticProfile.getCountOfVisits(request.body.decoded.id),
      };

      response.status(HttpResponse.Ok).json(analitic);
    } catch (error) {
      response.status(HttpResponse.BadRequest).send("cannot get analytic");
    }
  }

  /**
   * Retorna la cantidad de visitas al perfil en una semana
   * @param request
   * @param response
   */
  public async getVisitsByWeek(request: Request, response: Response) {
    let date = request.params.date;
    let user = request.body.decoded.id;
    try {
      let events = await Analytic.visitsInWeek(date, user);
      response.status(HttpResponse.Ok).json(events);
    } catch (error) {
      response.status(HttpResponse.BadRequest).send(error);
    }
  }

  /**
   * Retorna la analitica de las veces que se clickeo en los botones de la appstore y playstore
   */
  public getStoreClics(request: Request, response: Response) {
    AnalyticStore.getAllData()
      .then((data) => {
        response.status(HttpResponse.Ok).json(data);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot find data");
      });
  }

  // /**
  //  * Retorna la cantidad de visitas o clis, a un regalo en una lista de regalos compartida al exterior
  //  */

  // public async getVisitsByTodo(request: Request, response: Response) {
  //   let visits =
  //     (await AnalyticTodoListView.getCountOfVisits(request.params.id)) || 0;
  //   response.status(HttpResponse.Ok).json({ visits });
  // }
  // /**
  //  * Retorna la cantidad de visitas a una lista de regalos
  //  */
  // public async getVisitsByListGift(request: Request, response: Response) {
  //   let visits = await AnalyticListGiftView.getCountOfVisits(request.params.id);
  //   let last =
  //     (await AnalyticListGiftView.getLastVisits(request.params.id))[0] || null;
  //   let current = await AnalyticListGiftView.getCountOfCurrentVisits(
  //     request.params.id
  //   );
  //   response.status(HttpResponse.Ok).json({ visits, last, current });
  // }

  // /**
  //  * Retorna el registro de quien se encargara de un regalo
  //  */
  // public async getRecordTodoGiver(request: Request, response: Response) {
  //   let id = request.params.id;
  //   let record =
  //     (await AnalyticGiverTodoList.getLastRecordByTodo(id))[0] || null;
  //   response.status(HttpResponse.Ok).json(record);
  // }

  /**
   * Retorna la cantidad de seguidores / seguidos de un usuario
   */

  public async getFolowAnalyticUser(request: Request, response: Response) {
    // id del usuario
    let id = request.params.id;
    try {
      // obtenemos la cantidad de seguidores y seguidos
      let data = await Friend.followerAndFollowingsByUser(id);
      // enviamos la data
      response.status(HttpResponse.Ok).json(data);
    } catch (error) {
      response.status(HttpResponse.BadRequest).send(error);
    }
  }
}
