import { NewsController } from '../controllers/newsController';
import { Authentication } from './middleware/authentication';

/**
 * newsleRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const newsController = new NewsController();

/**
 * Habilita el Router
 */
const NewsRouter:any = newsController.router();

/**
 * Crear una noticia
 * 
 * 
 * @route /v1/news/create
 * @method post
 */
NewsRouter.post('/create', newsController.create);

/**
 * Obtiene todas las noticias
 * 
 * 
 * @route /v1/news
 * @method get
 */
NewsRouter.get('/', newsController.findNews);

/**
 * Obtiene una noticia por id
 * 
 * 
 * @route /v1/news/:id
 * @method get
 */
NewsRouter.get('/:id', newsController.findOneNews);

/**
 * Obtiene las noticias por deporte
 * 
 * 
 * @route /v1/news/sport/:id
 * @method get
 */
NewsRouter.get('/sport/:id', newsController.findBySport);

/**
 * Obtiene las noticias de un usuario por id
 * 
 * 
 * @route /v1/news/user/:id
 * @method get
 */
NewsRouter.get('/own/:id', newsController.findMyNewss);

/**
 * Obtiene las noticias borradas de un usuario por id
 * 
 * 
 * @route /v1/news/deleted/:id
 * @method get
 */
 NewsRouter.get('/deleted/:id', newsController.findMyNewsDeleted);

/**
 * Obtiene las noticias programadas de un usuario por id
 * 
 * 
 * @route /v1/news/programated/:id
 * @method get
 */
 NewsRouter.get('/programated/:id', newsController.findMyNewsProgramated);


/**
 *Reprograma la noticia 
 * 
 * 
 * @route /v1/news/rescheduleNews/:id
 * @method get
 */
 NewsRouter.put('/rescheduleNews/:id', newsController.rescheduleNews);


/**
 * Obtiene las noticias de un usuario por id
 * 
 * 
 * @route /v1/news/update/:id
 * @method put
 */
NewsRouter.put('/update/:id', newsController.updateNews);

/**
 * Obtiene las noticias de un usuario por id
 * 
 * 
 * @route /v1/news/delete/:id
 * @method delete
 */
NewsRouter.delete('/delete/:id', newsController.deleteOneById);

/**
 * Obtiene las noticias de un usuario por id
 * 
 * 
 * @route /v1/news/restore/:id
 * @method 
 */
 NewsRouter.put('/restore/:id', newsController.restoreOneById);


/**
 * Obtiene las noticias de un usuario por id
 * 
 * 
 * @route /v1/news/delete/:id
 * @method delete
 */
NewsRouter.put('/like/:id',Authentication.jwt, newsController.likeNews);


/**
  * Quitar like a una noticia
  * 
  * @route /v1/news/dislike/:id
  * @method put
  * @param id id del news
  */

NewsRouter.put('/dislike/:id',Authentication.jwt,newsController.dislikeNews)



/**
  * Crea un nuevo comentario a una noticia
  * 
  * @route /v1/news/comment
  * @method post
  */

 NewsRouter.post('/comment',Authentication.jwt,newsController.newComment)

/**
  * Obtiene los compartidos de una noticia
  * 
  * @route /v1/news/shareds/:id
  * @method get
  */

 NewsRouter.get('/shareds/:id',Authentication.jwt,newsController.getSharedsByPost)


 /**
 * Cambiar el tipo de reaccion
 *
 * @route /v1/news/changereact/:id/:type
 * @method put
 * @param id id de la reaccion
 * @param type tipo o id de la nueva reaccion
 */

  NewsRouter.put(
    "/changereact/:id/:type",
    Authentication.jwt,
    newsController.changeReact
  );


  /**
 *  Cantidad de reacciones en un noticia
 *
 * @route /v1/news/reactions/:id/
 * @method get
 */

   NewsRouter.get("/reactions/:id", newsController.countReactionsNews);


    /**
 * Retorna si un usuario reacciono a un noticia o no
 *
 * @route /v1/news/reacted/:id/:user
 * @method get
 */

  NewsRouter.get("/reacted/:id/:user", newsController.userReactToNews);


  /**
 * Retorna la cantidad de comentarios en una noticia
 *
 * @route /v1/news/countcomments/:id/
 * @method get
 */

   NewsRouter.get("/countcomments/:id", newsController.countCommentsInNews);


 /**
 * Saber si un usuario comento una noticia
 *
 * @route /v1/news/usercomment/:id/:user
 * @method get
 */

  NewsRouter.get("/usercomment/:id/:user", newsController.userCommentNews);



  /**
 *  Cantidad de comparticiones en una noticia
 *
 * @route /v1/news/totalshareds/:id/
 * @method get
 */

   NewsRouter.get("/totalshareds/:id", newsController.totalShared);

  /**
 * Retorna cierta cantidad de comentarios en una noticia
 *
 * @route /v1/news/comments/:id/:skip
 * @method get
 */

   NewsRouter.get("/comments/:id/:skip", newsController.getCommentsInNews);



/**
 * Retorna la cantidad de cada reaccion en una noticia
 *
 * @route /v1/news/totalReactions/:id
 * @method get
 */

 NewsRouter.get("/totalReactions/:id", newsController.countTotalOfEachReactionNews);

 /**
  * Retorna cierta cantidad de reacciones de cualquier tipo a una noticia
  *
  * @route /v1/news/anyreactions/:id/:skip
  * @method get
  */
 
  NewsRouter.get("/anyreactions/:id/:skip", newsController.getAllReactionsNews);
 
 
 /**
  * Retorna cierta cantidad de reacciones de un tipo en especifico
  *
  * @route /v1/news/reactionstype/:id/:type/:skip
  * @method get
  */
 
  NewsRouter.get("/reactionstype/:id/:type/:skip",newsController.getReactionsByTypeInNews);
   
module.exports = NewsRouter;
