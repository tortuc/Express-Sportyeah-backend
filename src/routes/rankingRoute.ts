import { RankingController } from '../controllers/rankingController';

/**
 * exampleRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */

/**
 * Carga el controlador
 */
const rankingController = new RankingController();

/**
 * Habilita el Router
 */
const RankingRoute:any = rankingController.router();

/**
 * index
 * 
 * Ruta por defecto
 * 
 * @route /example/
 * @method get
 */
RankingRoute.get('/', rankingController.index);

/**
 * Obtiene el ranking de las reacciones en los posts, desde siempre
 * @method get 
 * @route /v1/ranking/reactions/ever/:user
 */

RankingRoute.get('/reactions/ever/:user/:country',rankingController.getReactionsPostRankingSinceEver)

/**
 * Obtiene el ranking de los "compartidos" en los posts, desde siempre
 * @method get 
 * @route /v1/ranking/shareds/ever/:user
 */

RankingRoute.get('/shareds/ever/:user/:country',rankingController.getSharedPostRankingSinceEver)
/**
 * Obtiene el ranking de los comentarios en los posts, desde siempre
 * @method get 
 * @route /v1/ranking/comments/ever/:user
 */

RankingRoute.get('/comments/ever/:user/:country',rankingController.getCommentsPostRankingSinceEver)

   /**
 * Obtiene el ranking de los views en los posts, desde siempre
 * @method get 
 * @route /v1/ranking/comments/day/:user/:dateStart/:dateEnd
 */

    RankingRoute.get('/views/ever/:user/:country',rankingController.getViewsPostRankingSinceEver)

   /**
 * Obtiene el ranking de los followers en los posts, desde siempre
 * @method get 
 * @route /v1/ranking/comments/day/:user/:dateStart/:dateEnd
 */

    RankingRoute.get('/followers/ever/:user/:country',rankingController.getFollowersPostRankingSinceEver)

   /**
 * Obtiene el ranking de los followers en los posts, desde siempre
 * @method get 
 * @route /v1/ranking/comments/day/:user/:dateStart/:dateEnd
 */

    RankingRoute.get('/viewsSearch/ever/:user/:country',rankingController.getviewsProfileAllSearchRankingSinceEver)


     /**
 * Obtiene el ranking de los followers en los posts, desde siempre
 * @method get 
 * @route /v1/ranking/comments/day/:user/:dateStart/:dateEnd
 */

      RankingRoute.get('/rebound/ever/:user/:country',rankingController.getViewsProfileReboundAllTime)


////////////////  Fechas //////////////////

/**
 * Obtiene el ranking de las reacciones en los posts, desde la fecha que se le pase
 * @method get 
 * @route /v1/ranking/comments/ever/:user/:dateStart/:dateEnd
 */

 RankingRoute.get('/reactions/day/:user/:country/:dateStart/:dateEnd',rankingController.getReactionsPostRankingDays)

 /**
 * Obtiene el ranking de los comentarios en los posts, desde la fecha que se le pase
 * @method get 
 * @route /v1/ranking/comments/day/:user/:dateStart/:dateEnd
 */

  RankingRoute.get('/comments/day/:user/:country/:dateStart/:dateEnd',rankingController.getCommentsPostRankingDays)


  /**
 * Obtiene el ranking de los comentarios en los posts, desde la fecha que se le pase
 * @method get 
 * @route /v1/ranking/comments/day/:user/:dateStart/:dateEnd
 */

 RankingRoute.get('/shareds/day/:user/:country/:dateStart/:dateEnd',rankingController.getSharedPostRankigDays)


   /**
 * Obtiene el ranking de los views en los posts, desde la fecha que se le pase
 * @method get 
 * @route /v1/ranking/comments/day/:user/:dateStart/:dateEnd
 */

 RankingRoute.get('/views/day/:user/:country/:dateStart/:dateEnd',rankingController.getPostViewsByTime)


   /**
 * Obtiene el ranking de los followers en los posts, desde la fecha que se le pase
 * @method get 
 * @route /v1/followers/day/:user/:dateStart/:dateEnd
 */

RankingRoute.get('/followers/day/:user/:country/:dateStart/:dateEnd',rankingController.getfollowersByTime)

    /**
 * Obtiene el ranking obtine las vistas por busqueda a un perfil por fechas
 * @method get 
 * @route /v1/followers/day/:user/:dateStart/:dateEnd
 */

     RankingRoute.get('/viewsSearch/day/:user/:country/:dateStart/:dateEnd',rankingController.getViewsProfileSearchByTime)

   /**
 * Obtiene el ranking obtine las vistas por busqueda a un perfil por fechas
 * @method get 
 * @route /v1/followers/day/:user/:dateStart/:dateEnd
 */

   RankingRoute.get('/rebound/day/:user/:country/:dateStart/:dateEnd',rankingController.getViewsProfileReboundByTime)



module.exports = RankingRoute;
