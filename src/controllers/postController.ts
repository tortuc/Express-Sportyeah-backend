import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import Post from "../models/post";
import Like from "../models/like";
import Comment from "../models/comment";
import User from "../models/user";
import { Alert } from "../helpers/alert";
import { PostFilter } from "../helpers/postFilter";
import { Net } from "../helpers/net";
import { userHelper } from "../helpers/userHelper";

import * as moment from "moment";
import Sponsor from "../models/sponsor";

/**
 * PostController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class PostController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Crear un Post
   *
   * @route /v1/post/create
   * @method post
   */
  public create(request: Request, response: Response) {
    Post.create(request.body)
      .then((resp) => {
        if (resp.post != null) {
          Alert.sharedNotification(resp);
        }
        if (resp.files.length > 0) {
          userHelper.uploadFilesToGallery(resp);
        }
        Alert.mentionsPost(resp);
        response.status(HttpResponse.Ok).json(resp);
      })
      .catch((err) => {
        console.log(err);

        response.status(HttpResponse.BadRequest).send("cannot-create");
      });
  }

  /**
   * Retorna las publicaciones que ha hecho el usuario que consulta
   */

  public getMyPosts(request: Request, response: Response) {
    const userId = request.body.decoded.id;
    User.findById(userId)
      .then(async (user) => {
        // una REGEX para saber si hay post donde lo hayan mencionado
        let regex = `/user/${user.username}`;
        // paginacion
        let skip = Number(request.params.skip);
        // si el usuario es patrocinador, deberia encontrar patrocinados y mostrar sus postss
        let sponsoreds: any[] = ((await Sponsor.getUsersBySponsorID(
          userId
        )) as any[]).map((x) => {
          return (x = x.user);
        });
        let ids = [userId].concat(sponsoreds);

        Post.findMyPosts(ids, regex, skip)
          .then((posts) => {
            response.status(HttpResponse.Ok).json(posts);
          })
          .catch((err) => {
            response.status(HttpResponse.BadRequest).send("unknow error");
          });
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("unknow error");
      });
  }

  /**
   * Obtiene las publicaciones de los amigos (siguiendo) del usuario
   */
  public async friendsPosts(request: Request, response: Response) {
    let skip = request.body.skip;
    let days = request.body.days;
    let limitDate = moment().subtract(days, "days");

    /**
     *  Se hace un map para poder obtener solo los id de los usuarios, ya que este llega como un objeto
     *  donde viene el _id del registro de Friend y el User
     */
    let ids: any[] = await request.body.friends_id.map((id) => {
      return (id = id.user._id);
    });

    if (ids.length == 0) {
      ids = await userHelper.newUserPosts(request.body.decoded.id);
    }

    /**
     * una vez formateado los id de los usuarios, le agregamos el id del usuario que esta haciendo la peticion
     * para tambien obtener sus post
     */
    ids.push(request.body.decoded.id);
    Post.findByFriends(ids, skip, limitDate)
      .then((posts) => {
        response.status(HttpResponse.Ok).json(posts);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot get posts");
      });
  }

  public findByUser(request: Request, response: Response) {
    let user = request.params.id;
    Post.findByUser(user).then((posts) => {
      let postsAndLikes = [];
      let j = 0;
      if (posts.length == 0) {
        response.status(HttpResponse.Ok).json(postsAndLikes);
      } else {
        posts.forEach((post, i, arr) => {
          Comment.getCommentsByPost(post._id)
            .then((comments) => {
              postsAndLikes.push({
                post,
                comments,
              });
              j++;
              if (j == arr.length) {
                postsAndLikes.sort((a, b) => {
                  return b.post.date.getTime() - a.post.date.getTime();
                });
                response.status(HttpResponse.Ok).json(postsAndLikes);
              }
            })
            .catch((err) => {
              response
                .status(HttpResponse.InternalError)
                .send("cannot get comments");
            });
        });
      }
    });
  }

  public deleteOne(request: Request, response: Response) {
    Post.deleteOneById(request.params.id)
      .then((resp) => {
        response.status(HttpResponse.Ok).json(resp);
      })
      .catch((err) => {
        response.status(HttpResponse.Ok).json(err);
      });
  }

  public updateOne(request: Request, response: Response) {
    request.body.edited = Date.now();
    Post.updatePost(request.params.id, request.body)
      .then((resp) => {
        response.status(HttpResponse.Ok).json(resp);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot update post");
      });
  }
  /**
   * Reaccionar a una publicacion
   */

  public likePost(request: Request, response: Response) {
    // obtenemos los datos de la reaccion

    let like = {
      user: request.body.decoded.id, // usuario que reacciono
      post: request.params.id, // publicacion a la que reacciono
      type: request.body.id_reaction, // tipo de reaccion
    };
    Like.addLike(like)
      .then(async (like) => {
        // una vez reaccione, entonces se obtienen la cantidad de reacciones a este post
        let likes = await Like.getLikesByPost(like.post);
        // se notifica al creador del post, que reaccionaron
        Alert.likeNotification(like);
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
  public dislikePost(request: Request, response: Response) {
    Like.dislike(request.params.id)
      .then(async (like) => {
        // luego que eliminemos la reaccion buscamos todas las reacciones de ese post, para actualizar las demas reacciones al usuario
        let likes = await Like.getLikesByPost(like.post);

        // respondemos con la cantidad reacciones

        response.status(HttpResponse.Ok).json(likes);
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("cannot disliked");
      });
  }

  /**
   * Obtiene la informacion de una publicacion
   * (Reacciones, comentarios y comparticiones)
   */

  public getPost(request: Request, response: Response) {
    Post.findOnePost(request.params.id)
      .then(async (post) => {
        if (post) {
          let geo = Net.geoIp(Net.ip(request));
          await PostFilter.findIpView(request.params.id, geo.ip);
          response.status(HttpResponse.Ok).json(post);
        } else {
          response.status(HttpResponse.InternalError).send("cannot get post");
        }
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("cannot get post");
      });
  }

  public newComment(request: Request, response: Response) {
    let comment = request.body;
    comment.user = comment.decoded.id;
    delete comment.decoded;

    Comment.newComment(comment)
      .then(async (comment) => {
        await User.populate(comment, { path: "user" });
        Alert.commentAlert(comment);
        Alert.mentionsComment(comment);
        response.status(HttpResponse.Ok).json(comment);
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("cannot comment");
      });
  }

  /**
   * Obtiene las publicaciones de un usuario en especifico
   */

  public getPostsByUserId(request: Request, response: Response) {
    User.findById(request.params.id).then((user) => {
      // obtenemos la REGEX para saber si hay publicaciones donde hayan mnencionado a ese usuario
      let regex = `/user/${user.username}`;
      // para hacer la paginacion
      let skip = Number(request.params.skip);
      Post.findMyPosts(request.params.id, regex, skip)
        .then((posts) => {
          response.status(HttpResponse.Ok).json(posts);
        })
        .catch((err) => {
          response.status(HttpResponse.BadRequest).send("unknow error");
        });
    });
  }

  /**
   * Obtiene las comparticiones de una publicacion por cantidades de 10
   */
  public getSharedsByPost(request: Request, response: Response) {
    let skip = Number(request.params.skip);
    Post.getSharedsByPost(request.params.id, skip)
      .then((posts) => {
        response.status(HttpResponse.Ok).json(posts);
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("cannot get shared");
      });
  }

  public getCountPost(request: Request, response: Response) {
    Post.getCountPostByUser(request.params.id)
      .then((count) => {
        response.status(HttpResponse.Ok).json({ count });
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("cannot count post");
      });
  }

  public findAllPost(request: Request, response: Response) {
    Post.findAllPost().then((posts) => {
      //response.status(HttpResponse.Ok).json(posts)
      let postsAndLikes = [];
      let j = 0;
      if (posts.length == 0) {
        response.status(HttpResponse.Ok).json(postsAndLikes);
      } else {
        posts.forEach((post, i, arr) => {
          Comment.getCommentsByPost(post._id)
            .then((comments) => {
              postsAndLikes.push({
                post,
                comments,
              });
              j++;
              if (j == arr.length) {
                postsAndLikes.sort((a, b) => {
                  return b.post.date.getTime() - a.post.date.getTime();
                });
                response.status(HttpResponse.Ok).json(postsAndLikes);
              }
            })
            .catch((err) => {
              response
                .status(HttpResponse.InternalError)
                .send("cannot get comments");
            });
        });
      }
    });
  }

  /**
   * Obtiene cierta cantidad de comentarios en un post
   */

  public async getCommentsInPost(request: Request, response: Response) {
    try {
      // obtenemos el id del post
      let id = request.params.id;
      // paginacion
      let skip = Number(request.params.skip);
      // obtenemos  la cantidad de comentarios
      let comments = await Comment.getCommentsByPost(id, skip);
      // retornamos la cantidad de comentarios
      response.status(HttpResponse.Ok).json(comments);
    } catch (error) {
      // hubo un error
      response.status(HttpResponse.BadRequest).send("something went wrong");
    }
  }

  /**
   * Retorna si un usuario a reaccionado a una publicacion
   *
   * y devuelve la info de la reaccion
   */
  public userReactToPost(request: Request, response: Response) {
    // obtenemos el id del post, y el id del usuario
    let { id, user } = request.params;
    // Buscamos si ha reaccionado
    Like.userReactToPost(id, user)
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
        // una vez reaccione, entonces se obtienen la cantidad de reacciones a este post
        let likes = await Like.getLikesByPost(like.post);
        // se notifica al creador del post, que reaccionaron
        Alert.likeNotification(like);
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
    // obtenemos el id del post
    let id = request.params.id;
    // buscamos el total de cada reaccion
    Like.countTotalOfEachReaction(id)
      .then((data) => {
        // respondemos con la data
        response.status(HttpResponse.Ok).json(data);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot get data");
      });
  }

  /**
   * Retorna de a 15 reacciones, de cualquier tipo en un post
   */
  public getAllReactionsPost(request: Request, response: Response) {
    // obtenemos el id del post
    let { id } = request.params;
    // obtenemos la paginacion
    let skip = Number(request.params.skip);
    Like.allReactionsPostUsers(id, skip)
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
   * Retorna de a 15 reacciones, de cualquier de unn tipo en especifico en una publicacion
   */
  public getReactionsByTypeInPost(request: Request, response: Response) {
    // obtenemos el id del post
    let { id } = request.params;
    // obtenemos la paginacion
    let skip = Number(request.params.skip);
    // obtenemos el tipo de reaccion
    let type = Number(request.params.type);
    Like.reactionsByTypePostUsers(id, type, skip)
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

  public async countReactionsPost(request: Request, response: Response) {
    // obtenemos el id del post
    let id = request.params.id;
    try {
      // obtenemos la cantidad de reacciones de la publicacion
      let count = await Like.getLikesByPost(id);

      // la retornamos
      response.status(HttpResponse.Ok).json(count);
    } catch (error) {
      response.status(HttpResponse.BadRequest).send(error);
    }
  }

  /**
   * Obtiene la cantidad de comentarios en un post
   */

  public async countCommentsInPost(request: Request, response: Response) {
    try {
      // obtenemos el id del post
      let id = request.params.id;
      // obtenemos  la cantidad de comentarios
      let comments = await Comment.getCountOfCommentsByPost(id);
      // retornamos la cantidad de comentarios
      response.status(HttpResponse.Ok).json(comments);
    } catch (error) {
      // hubo un error
      response.status(HttpResponse.BadRequest).send("something went wrong");
    }
  }

  /**
   * Saber si un un usuario ha comentado una publiacion
   */
  public async userCommentPost(request: Request, response: Response) {
    try {
      // obtenemos el _id del post y el _id del usuario
      let { id, user } = request.params;

      let comment = await Comment.userCommentPost(user, id);
      response.status(HttpResponse.Ok).json(comment);
    } catch (error) {
      response.status(HttpResponse.BadRequest).send("error");
    }
  }

  /**
   * Retorna la cantidad de comparticiones en un post
   */
  public async totalShared(request: Request, response: Response) {
    // obtenemos el id del post
    let id = request.params.id;
    // obtenemos la cantidad total de veces que se compartio
    try {
      let shareds = await Post.getTotalSharedsByPost(id);
      // respondemos con la cantidad
      response.status(HttpResponse.Ok).json(shareds);
    } catch (error) {
      response.status(HttpResponse.BadRequest).send(error);
    }
  }
}
