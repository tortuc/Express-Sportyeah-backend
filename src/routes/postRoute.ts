import { PostController } from '../controllers/postController';
import { Authentication } from './middleware/authentication';
/**
 * postRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */

/**
 * Carga el controlador
 */
const postController = new PostController();

/**
 * Habilita el Router
 */
const PostRoute:any = postController.router();

/**
 * Crear un post
 * 
 * 
 * @route /v1/post/create
 * @method post
 */
PostRoute.post('/create', postController.create);

/**
 * Obtiene los post del usuario
 * 
 * 
 * @route /v1/post/own
 * @method get
 */
PostRoute.get('/own/:skip',Authentication.jwt, postController.getMyPosts);

/**
 * Obtiene los post de un usuario por id
 * 
 * 
 * @route /v1/post/user/:id/:skip
 * @method get
 */
PostRoute.get('/user/:id/:skip',Authentication.jwt, postController.getPostsByUserId);
/**
 * Crear un post
 * 
 * 
 * @route /v1/post/friends
 * @method post
 */
PostRoute.post('/friends',Authentication.jwt, postController.friendsPosts);

/**
 * Elimina un Post
 * 
 * 
 * @route /v1/post/:id
 * @method delete
 */
PostRoute.delete('/:id', postController.deleteOne);

/**
 * Modificar un post
 * 
 * 
 * @route /v1/post/update/:id
 * @method put
 */
PostRoute.put('/update/:id', postController.updateOne);

 /**
  * Dar like a un post
  * 
  * @route /v1/post/like/:id
  * @method put
  * @param id id del post
  * @param reaction id de la reacción
  */

PostRoute.put('/like/:id',Authentication.jwt,postController.likePost)
 /**
  * Quitar like a un post
  * 
  * @route /v1/post/dislike/:id
  * @method put
  * @param id id del post
  */

PostRoute.put('/dislike/:id',Authentication.jwt,postController.dislikePost)

 /**
  * Obtiene un post con toda su informacion, likes, comentarios, compartidos
  * 
  * @route /v1/post/get/:id
  * @method get
  * @param id id del post
  */

PostRoute.get('/get/:id',postController.getPost)

/**
  * Crea un nuevo comentario a un post
  * 
  * @route /v1/post/comment
  * @method post
  */

 PostRoute.post('/comment',Authentication.jwt,postController.newComment)


 /**
 * Retorna cierta cantidad de comentarios en una publicacion
 *
 * @route /v1/post/comments/:id/:skip
 * @method get
 */

PostRoute.get("/comments/:id/:skip", postController.getCommentsInPost);

/**
  * Obtiene los compartidos de un post
  * 
  * @route /v1/post/shareds/:id
  * @method get
  */

 PostRoute.get('/shareds/:id',Authentication.jwt,postController.getSharedsByPost)

/**
  * Obtiene la cantidad de post por usuario
  * 
  * @route /v1/post/count/:id
  * @method get
  */

 PostRoute.get('/count/:id',postController.getCountPost)

 /**
  * Obtiene los post por usuario
  * 
  * @route /v1/post/post
  * @method get
  */

 PostRoute.get('/post/:id',postController.findByUser)


 /**
  * Obtiene todos los post
  * 
  * @route /v1/post/post/all
  * @method get
  */

 PostRoute.get('/all',postController.findAllPost)

 /**
 * Retorna si un usuario reacciono a un post o no
 *
 * @route /v1/post/reacted/:id/:user
 * @method get
 */

PostRoute.get("/reacted/:id/:user", postController.userReactToPost);

/**
 * Cambiar el tipo de reaccion
 *
 * @route /v1/post/changereact/:id/:type
 * @method put
 * @param id id de la reaccion
 * @param type tipo o id de la nueva reaccion
 */

 PostRoute.put(
  "/changereact/:id/:type",
  Authentication.jwt,
  postController.changeReact
);

/**
 * Retorna la cantidad de cada reaccion en una publicacion
 *
 * @route /v1/post/totalReactions/:id
 * @method get
 */

 PostRoute.get("/totalReactions/:id", postController.countTotalOfEachReaction);

 /**
  * Retorna cierta cantidad de reacciones de cualquier tipo a una publicacion
  *
  * @route /v1/post/anyreactions/:id/:skip
  * @method get
  */
 
 PostRoute.get("/anyreactions/:id/:skip", postController.getAllReactionsPost);
 
 /**
  * Retorna cierta cantidad de reacciones de un tipo en especifico
  *
  * @route /v1/post/reactionstype/:id/:type/:skip
  * @method get
  */
 
 PostRoute.get(
   "/reactionstype/:id/:type/:skip",
   postController.getReactionsByTypeInPost
 );

 /**
 *  Cantidad de reacciones en un post
 *
 * @route /v1/post/reactions/:id/
 * @method get
 */

PostRoute.get("/reactions/:id", postController.countReactionsPost);


/**
 * Retorna la cantidad de comentarios en una publicacion
 *
 * @route /v1/post/countcomments/:id/
 * @method get
 */

 PostRoute.get("/countcomments/:id", postController.countCommentsInPost);

 /**
 * Saber si un usuario comento una publicacion
 *
 * @route /v1/post/usercomment/:id/:user
 * @method get
 */

PostRoute.get("/usercomment/:id/:user", postController.userCommentPost);

/**
 *  Cantidad de comparticiones en un post
 *
 * @route /v1/post/totalshareds/:id/
 * @method get
 */

 PostRoute.get("/totalshareds/:id", postController.totalShared);

 
module.exports = PostRoute;
