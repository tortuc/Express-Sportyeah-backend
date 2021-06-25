import { CommentController } from "../controllers/commentController";
import { Authentication } from "./middleware/authentication";

/**
 * commentRoute
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const commentController = new CommentController();

/**
 * Habilita el Router
 */
const commentRoute: any = commentController.router();

/**
 * Dar like a un comment
 *
 * @route /v1/comment/like/:id
 * @method put
 * @param id id del comment
 * @param reaction id de la reacción
 */

commentRoute.put(
  "/like/:id",
  Authentication.jwt,
  commentController.likeComment
);
/**
 * Quitar like a un comment
 *
 * @route /v1/comment/dislike/:id
 * @method put
 * @param id id del comment
 */

commentRoute.put(
  "/dislike/:id",
  Authentication.jwt,
  commentController.dislikeComment
);

/**
 * Retorna cierta cantidad de reacciones de cualquier tipo a un comentario
 *
 * @route /v1/comment/anyreactions/:id/:skip
 * @method get
 */

commentRoute.get(
  "/anyreactions/:id/:skip",
  commentController.getAllReactionsComment
);

/**
 * Retorna si un usuario reacciono a un comentario o no
 *
 * @route /v1/comment/reacted/:id/:user
 * @method get
 */

commentRoute.get("/reacted/:id/:user", commentController.userReactToComment);

/**
 * Cambiar el tipo de reaccion
 *
 * @route /v1/comment/changereact/:id/:type
 * @method put
 * @param id id de la reaccion
 * @param type tipo o id de la nueva reaccion
 */

commentRoute.put(
  "/changereact/:id/:type",
  Authentication.jwt,
  commentController.changeReact
);

/**
 * Retorna la cantidad de cada reaccion en un comentario
 *
 * @route /v1/comment/totalReactions/:id
 * @method get
 */

commentRoute.get(
  "/totalReactions/:id",
  commentController.countTotalOfEachReaction
);

/**
 * Retorna cierta cantidad de reacciones de un tipo en especifico
 *
 * @route /v1/comment/reactionstype/:id/:type/:skip
 * @method get
 */

commentRoute.get(
  "/reactionstype/:id/:type/:skip",
  commentController.getReactionsByTypeInComment
);

/**
 *  Cantidad de reacciones en un comentario
 *
 * @route /v1/comment/reactions/:id/
 * @method get
 */

commentRoute.get("/reactions/:id", commentController.countReactionsComment);

/**
 * Retorna la cantidad de comentarios (respuestas) en un comentario
 *
 * @route /v1/comment/countcomments/:id/
 * @method get
 */

commentRoute.get(
  "/countcomments/:id",
  commentController.countCommentsInComment
);

/**
 * Saber si un usuario comento (respondio) un comentario
 *
 * @route /v1/comment/usercomment/:id/:user
 * @method get
 */

commentRoute.get(
  "/usercomment/:id/:user",
  commentController.userRespondComment
);

/**
 * Retorna cierta cantidad de comentarios en una publicacion
 *
 * @route /v1/post/comments/:id/:skip
 * @method get
 */

 commentRoute.get("/comments/:id/:skip", commentController.getRespondsInComment);

module.exports = commentRoute;
