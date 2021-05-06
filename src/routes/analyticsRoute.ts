import { AnalyticsController } from "../controllers/analyticsController";
import { Authentication } from "./middleware/authentication";

/**
 * AnalyticsRoute
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

/**
 * Carga el controlador
 */
const analyticsController = new AnalyticsController();

/**
 * Habilita el Router
 */
const AnalyticsRouter: any = analyticsController.router();

/**
 *
 * Analytics landing page
 *
 * @route /v1/analytics/landing
 * @method get
 */
AnalyticsRouter.get("/landing", analyticsController.getDataLanding);

/**
 *
 * Analytics external shared
 *
 * @route /v1/analytics/external
 * @method get
 */
AnalyticsRouter.get("/external", analyticsController.getDataExternalShared);

/**
 *
 * @route /v1/analytics/lastusers
 * @method get
 */
AnalyticsRouter.get("/lastusers/:date", analyticsController.getLastSignup);

/**
 *
 * @route /v1/analytics/usersonlines
 * @method get
 */
AnalyticsRouter.get("/usersonlines", analyticsController.totalUsers);

// /**
//  *
//  * @route /v1/analytics/events:/date
//  * @method get
//  */
// AnalyticsRouter.get("/events/:date", analyticsController.getLastEvents);

/**
 *
 * Trae la cantidad de visitas al perfil por semana
 *
 * @route /v1/analytics/visits:/date
 * @method get
 */
AnalyticsRouter.get(
  "/visits/:date",
  Authentication.jwt,
  analyticsController.getVisitsByWeek
);

// /**
//  *
//  * @route /v1/analytics/eventsvisits
//  * @method get
//  */
// AnalyticsRouter.get("/eventsvisits", analyticsController.eventMosVisited);

/**
 *
 * @route /v1/analytics/popularuser
 * @method get
 */
AnalyticsRouter.get("/popularuser", analyticsController.mostPopularUser);

/**
 *
 * @route /v1/analytics/popularuser
 * @method get
 */
AnalyticsRouter.get("/popularuser", analyticsController.mostPopularUser);

/**
 * Obneter las visitas a mi perfil
 * @route /v1/analytics/visitsmyprofile
 * @method get
 */

AnalyticsRouter.get(
  "/visitsmyprofile",
  Authentication.jwt,
  analyticsController.VisitsToMyProfile
);

/**
 * Otener las analiticas de mi perfil
 * @route /v1/analytics/profile
 * @method get
 */

AnalyticsRouter.get(
  "/profile",
  Authentication.jwt,
  analyticsController.getAnaliticProfile
);

// /**
//  * Otener las analiticas los clicks a las stores de apps
//  * @route /v1/analytics/stores
//  * @method get
//  *
//  */

// AnalyticsRouter.get("/stores", analyticsController.getStoreClics);

// /**
//  * obtiene la cantidad de vistas o clics en un regalo o actividad en la lista de regalos compartida al exterior
//  * @route /v1/analytics/todo/visits/:id
//  * @method get
//  */

// AnalyticsRouter.get("/todo/visits/:id", analyticsController.getVisitsByTodo);

// /**
//  * Obtiene la analitica de una lista de regalo compartida al exterior
//  * @route /v1/analytics/list/visits/:id
//  * @method get
//  */

// AnalyticsRouter.get(
//   "/list/visits/:id",
//   analyticsController.getVisitsByListGift
// );
// /**
//  * Obtiene el ultimo registro de quien indico que regalara el "TODO"
//  * @method get
//  * @route /v1/analytics/todo/giver/record/:id
//  */
// AnalyticsRouter.get(
//   "/todo/giver/record/:id",
//   analyticsController.getRecordTodoGiver
// );
/**
 * Obtiene la cantidad de seguidores y seguidos por usuario
 * @method get
 * @route /v1/analytics/follows/:id
 */
AnalyticsRouter.get("/follows/:id", analyticsController.getFolowAnalyticUser);

module.exports = AnalyticsRouter;
