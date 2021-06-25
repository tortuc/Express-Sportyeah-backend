import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import Like from "../models/like";
import Comment from "../models/comment";

/**
 * CommentController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class CommentController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Reaccionar a una publicacion
   */

  public likeComment(request: Request, response: Response) {
    // obtenemos los datos de la reaccion

    let like = {
      user: request.body.decoded.id, // usuario que reacciono
      comment: request.params.id, // publicacion a la que reacciono
      type: request.body.id_reaction, // tipo de reaccion
    };

    Like.addLikeComment(like)
      .then(async (like) => {
        // una vez reaccione, entonces se obtienen la cantidad de reacciones a este comentario
        let likes = await Like.getLikesByComment(like.comment);
        // se notifica al creador del comentario, que reaccionaron
        // Alert.likeNotification(like);
        // respondemos con la nueva reaccion y la cantidad de reacciones
        response.status(HttpResponse.Ok).json({ like, likes });
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("cannot liked");
      });
  }
  /**
   * Quitar reaccion de una publicacion
   */
  public dislikeComment(request: Request, response: Response) {
    Like.dislike(request.params.id)
      .then(async (like) => {
        // luego que eliminemos la reaccion buscamos todas las reacciones de ese comentario, para actualizar las demas reacciones al usuario
        let likes = await Like.getLikesByComment(like.comment);

        // respondemos con la cantidad reacciones

        response.status(HttpResponse.Ok).json(likes);
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("cannot disliked");
      });
  }

  /**
   * Retorna de a 15 reacciones, de cualquier tipo en un comentario
   */
  public getAllReactionsComment(request: Request, response: Response) {
    // obtenemos el id del comentario
    let { id } = request.params;
    // obtenemos la paginacion
    let skip = Number(request.params.skip);
    Like.allReactionsCommentUsers(id, skip)
      .then((reactions) => {
        // retornamos las reacciones que encontremos
        response.status(HttpResponse.Ok).json(reactions);
      })
      .catch((err) => {
        // ocurrio un error
        response.status(HttpResponse.BadRequest).send("cannot get reactions");
      });
  }

  /**
   * Retorna si un usuario a reaccionado a un comentario
   *
   * y devuelve la info de la reaccion
   */
  public userReactToComment(request: Request, response: Response) {
    // obtenemos el id del comentario, y el id del usuario
    let { id, user } = request.params;
    // Buscamos si ha reaccionado
    Like.userReactToComment(id, user)
      .then((like) => {
        // respondemos con la reaccion
        response.status(HttpResponse.Ok).json(like);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot get reaction");
      });
  }

  /**
   * Cambiar tipo de reaccion
   */

  public changeReact(request: Request, response: Response) {
    // obtenemos el id de la reaccion y el nuevo tipo de reaccion
    let { id, type } = request.params;

    Like.changeReaction(id, type)
      .then(async (like) => {
        // una vez reaccione, entonces se obtienen la cantidad de reacciones a este comment
        let likes = await Like.getLikesByComment(like.comment);
        // se notifica al creador del comment, que reaccionaron
        // Alert.likeNotification(like);
        // respondemos con la nueva reaccion y la cantidad de reacciones
        response.status(HttpResponse.Ok).json({ like, likes });
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("cannot liked");
      });
  }

  /**
   * Cuenta el total de cada reaccion en una publicacion
   */

  public countTotalOfEachReaction(request: Request, response: Response) {
    // obtenemos el id del comment
    let id = request.params.id;
    // buscamos el total de cada reaccion
    Like.countTotalOfEachReactionComment(id)
      .then((data) => {
        // respondemos con la data
        response.status(HttpResponse.Ok).json(data);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot get data");
      });
  }


  
  /**
   * Retorna de a 15 reacciones, de cualquier de unn tipo en especifico en una publicacion
   */
   public getReactionsByTypeInComment(request: Request, response: Response) {
    // obtenemos el id del comentario
    let { id } = request.params;
    // obtenemos la paginacion
    let skip = Number(request.params.skip);
    // obtenemos el tipo de reaccion
    let type = Number(request.params.type);
    Like.reactionsByTypeCommentUsers(id, type, skip)
      .then((reactions) => {
        // retornamos las reacciones que encontremos
        response.status(HttpResponse.Ok).json(reactions);
      })
      .catch((err) => {
        // ocurrio un error
        response.status(HttpResponse.BadRequest).send("cannot get reactions");
      });
  }

   /**
   * Retorna la cantidad de reacciones en una publicacion
   *
   */

    public async countReactionsComment(request: Request, response: Response) {
        // obtenemos el id del comment
        let id = request.params.id;
        try {
          // obtenemos la cantidad de reacciones de la publicacion
          let count = await Like.getLikesByComment(id);
    
          // la retornamos
          response.status(HttpResponse.Ok).json(count);
        } catch (error) {
          response.status(HttpResponse.BadRequest).send(error);
        }
      }

       /**
   * Obtiene la cantidad de comentarios (respuestas) en un comentario
   */

  public async countCommentsInComment(request: Request, response: Response) {
    try {
      // obtenemos el id del post
      let id = request.params.id;
      // obtenemos  la cantidad de comentarios
      let comments = await Comment.getCountOfCommentsByComment(id);
      // retornamos la cantidad de comentarios
      response.status(HttpResponse.Ok).json(comments);
    } catch (error) {
      // hubo un error
      response.status(HttpResponse.BadRequest).send("something went wrong");
    }
  }


   /**
   * Saber si un un usuario ha comentado (Respondido) un comentario
   */
    public async userRespondComment(request: Request, response: Response) {
      try {
        // obtenemos el _id del comentario y el _id del usuario
        let { id, user } = request.params;
  
        let comment = await Comment.userRespondComment(user, id);
        response.status(HttpResponse.Ok).json(comment);
      } catch (error) {
        response.status(HttpResponse.BadRequest).send("error");
      }
    }


     /**
   * Obtiene cierta cantidad de comentarios en un post
   */

  public async getRespondsInComment(request: Request, response: Response) {
    try {
      // obtenemos el id del post
      let id = request.params.id;
      // paginacion
      let skip = Number(request.params.skip);
      // obtenemos  la cantidad de comentarios
      let comments = await Comment.getRespondsByComments(id, skip);
      // retornamos la cantidad de comentarios
      response.status(HttpResponse.Ok).json(comments);
    } catch (error) {
      // hubo un error
      response.status(HttpResponse.BadRequest).send("something went wrong");
    }
  }
}
