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

PostRoute.get('/get/:id/:idUser',postController.getPost)

/**
  * Crea un nuevo comentario a un post
  * 
  * @route /v1/post/comment
  * @method post
  */

 PostRoute.post('/comment',Authentication.jwt,postController.newComment)

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
 
module.exports = PostRoute;
