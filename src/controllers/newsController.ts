import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, Response } from 'express';
import News from '../models/news';
import Like from "../models/like";
import Comment from "../models/comment";
import Post from "../models/post";
import { Alert } from '../helpers/alert';
import { PostFilter } from "../helpers/postFilter";
import { NewsFilter } from "../helpers/newsFilter";
import { Net } from "../helpers/net";

/**
 * NewsController
 * 
 * Explica el objeto de este controlador
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */
 
export class NewsController extends BaseController
{
    /**
     * El constructor
     */
    public constructor()
    {
        // Llamamos al constructor padre
        super();
    }

/**
   * Crear una noticia
   *
   * @route /v1/news/create
   * @method news
   */
  public create(request: Request, response: Response) {
    News.create(request.body)
      .then((resp) => {
        response.status(HttpResponse.Ok).json(resp);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).json(err);
      });
  }

  /**
   * Encontrar Noticias
   *
   * @route /v1/news
   * @method news
   */
  public findNews(request: Request, response: Response) {
    News.findNews()
      .then((resp) => {
        response.status(HttpResponse.Ok).json(resp);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot-find-news");
      });
  }


/**
   * Encontrar Noticia
   *
   * @route /v1/news/find
   * @method news
   */
  public findOneNews(request: Request, response: Response) {
    News.findOneNews(request.params.id)
    .then((news) => {
      if(news){
          Like.getLikesByNews(news._id)
            .then((likes) => {
              Comment.getCommentsByNews(news._id)
                .then((comments) => {
                  Post.getSharedsByNews(news._id)
                    .then(async(shareds) => {
                      let question =
                      news.question != null
                        ? await NewsFilter.getDataQuestion(news.question)
                        : null;
                      let geo = Net.geoIp(Net.ip(request));
                      await NewsFilter.findIpView(request.params.id,geo.ip)
                      response.status(HttpResponse.Ok).json({
                        news,
                        likes,
                        comments,
                        shareds,
                        question
                      });
                    })

                    .catch((err) => {
                      response
                        .status(HttpResponse.InternalError)
                        .send("cannot get shareds");
                    });
                })
                .catch((err) => {
                  response
                    .status(HttpResponse.InternalError)
                    .send("cannot get comments");
                });
            })
            .catch((err) => {
              response
                .status(HttpResponse.InternalError)
                .send("cannot get likes");
            });
      }
    })
    .catch((err) => {
      response.status(HttpResponse.BadRequest).send("unknow error");
    });
        //response.status(HttpResponse.Ok).json(resp);
    /*   .catch((err) => {
        response.status(HttpResponse.BadRequest).json(err);
      }); */
}
    
    
  



  /**
   * Encontrar Noticias por Deporte
   *
   * @route /v1/news
   * @method news
   */
  public findBySport(request: Request, response: Response) {
      let sport = request.params.sport
    News.findBySport(sport)
      .then((resp) => {
        response.status(HttpResponse.Ok).json(resp);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot-find-news-by-sport");
      });
  }
  
  /**
   * Encontrar Noticias de un usuario
   *
   * @route /v1/news
   * @method news
   */
  public findMyNewss(request: Request, response: Response) {
    let user = request.params.id
  News.findMyNewss(user)
    .then((resp) => {
      response.status(HttpResponse.Ok).json(resp);
    })
    .catch((err) => {
      response.status(HttpResponse.BadRequest).send("cannot-find-news-by-user");
    });
}

/**
   * Editar Noticias 
   *
   * @route /v1/news/edit
   * @method news
   */
  public updateNews(request: Request, response: Response) {
    request.body.edited = Date.now();
    News.updateNews(request.body.id, request.body)
      .then((resp) => {
        response.status(HttpResponse.Ok).json(resp);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).json(err);
      });
  }

/**
   * Eliminar Noticias 
   *
   * @route /v1/news/delete
   * @method news
   */
  public deleteOneById(request: Request, response: Response) {
  News.deleteOneById(request.params.id)
    .then((resp) => {
      response.status(HttpResponse.Ok).json(resp);
    })
    .catch((err) => {
      response.status(HttpResponse.BadRequest).json(err);
    });
}
 
///////////Prueba de likes en noticias
public likeNews(request: Request, response: Response) {
  let like = {
    user: request.body.decoded.id,
    news: request.params.id,
    type: request.body.id_reaction,
  };
  Like.addLike(like)
  .then(async (like) => {
    // una vez reaccione, entonces se obtienen la cantidad de reacciones a este news
    let likes = await Like.getLikesByNews(like.news);
    // se notifica al creador del news, que reaccionaron
    Alert.likeNotification(like);
    // respondemos con la nueva reaccion y la cantidad de reacciones
    response.status(HttpResponse.Ok).json({ like, likes });
  })
  .catch((err) => {
    response.status(HttpResponse.InternalError).send("cannot liked");
  });
}

public changeReact(request: Request, response: Response) {
  // obtenemos el id de la reaccion y el nuevo tipo de reaccion
  let { id, type } = request.params;

  Like.changeReaction(id, type)
    .then(async (like) => {
      // una vez reaccione, entonces se obtienen la cantidad de reacciones a este news
      let likes = await Like.getLikesByNews(like.news);
      // se notifica al creador del news, que reaccionaron
      Alert.likeNotification(like);
      // respondemos con la nueva reaccion y la cantidad de reacciones
      response.status(HttpResponse.Ok).json({ like, likes });
    })
    .catch((err) => {
      response.status(HttpResponse.InternalError).send("cannot liked");
    });
}


  /**
   * Retorna la cantidad de reacciones en una noticia
   *
   */

   public async countReactionsNews(request: Request, response: Response) {
    // obtenemos el id del news
    let id = request.params.id;
    try {
      // obtenemos la cantidad de reacciones de la noticia
      let count = await Like.getLikesByNews(id);

      // la retornamos
      response.status(HttpResponse.Ok).json(count);
    } catch (error) {
      response.status(HttpResponse.BadRequest).send(error);
    }
  }

//dislikes
public dislikeNews(request: Request, response: Response) {
  Like.dislike(request.params.id)
  .then(async (like) => {
    // luego que eliminemos la reaccion buscamos todas las reacciones de ese post, para actualizar las demas reacciones al usuario
    let likes = await Like.getLikesByNews(like.news);

    // respondemos con la cantidad reacciones

    response.status(HttpResponse.Ok).json(likes);
  })
  .catch((err) => {
    response.status(HttpResponse.InternalError).send("cannot disliked");
  });
}

//comentarios
public newComment(request: Request, response: Response) {
  let comment = {
    user: request.body.decoded.id,
    news: request.body.news,
    message: request.body.message,
    image: request.body.image,
    question: request.body.question,
  };
  Comment.newComment(comment)
    .then((comment) => {
      Comment.getCommentsByNews(comment.news)
        .then((comments) => {
          Alert.commentNewsStream(comments,comment.news)
          response.status(HttpResponse.Ok).json(comments);
          /* Alert.commentAlert(comment);
          Alert.mentionsComment(comment); */
        })
        .catch((err) => {
          response
            .status(HttpResponse.InternalError)
            .send("cannot get comments");
        });
    })
    .catch((err) => {
      response.status(HttpResponse.InternalError).send("cannot comment");
    });
}

public getSharedsByPost(request: Request, response: Response) {
  News.getSharedsByNews(request.params.id)
    .then((news) => {
      response.status(HttpResponse.Ok).json(news);
    })
    .catch((err) => {
      response.status(HttpResponse.InternalError).send("cannot get shared");
    });
}


  /**
   * Retorna si un usuario a reaccionado a una publicacion
   *
   * y devuelve la info de la reaccion
   */
   public userReactToNews(request: Request, response: Response) {
    // obtenemos el id del news, y el id del usuario
    let { id, user } = request.params;
    // Buscamos si ha reaccionado
    Like.userReactToNews(id, user)
      .then((like) => {
        // respondemos con la reaccion
        response.status(HttpResponse.Ok).json(like);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot get reaction");
      });
  }


    /**
   * Obtiene la cantidad de comentarios en un news
   */

     public async countCommentsInNews(request: Request, response: Response) {
      try {
        // obtenemos el id del news
        let id = request.params.id;
        // obtenemos  la cantidad de comentarios
        let comments = await Comment.getCountOfCommentsByNews(id);
        // retornamos la cantidad de comentarios
        response.status(HttpResponse.Ok).json(comments);
      } catch (error) {
  
        // hubo un error
        response.status(HttpResponse.BadRequest).send("something went wrong");
      }
    }

      /**
   * Saber si un un usuario ha comentado una noticia
   */
  public async userCommentNews(request: Request, response: Response) {
    try {
      // obtenemos el _id del news y el _id del usuario
      let { id, user } = request.params;

      let comment = await Comment.userCommentNews(user, id);
      response.status(HttpResponse.Ok).json(comment);
    } catch (error) {
      response.status(HttpResponse.BadRequest).send("error");
    }
  }


  /**
   * Retorna la cantidad de comparticiones en un news
   */
   public async totalShared(request: Request, response: Response) {
    // obtenemos el id del news
    let id = request.params.id;
    // obtenemos la cantidad total de veces que se compartio
    try {
      let shareds = await Post.getTotalSharedsByNews(id);
      // respondemos con la cantidad
      response.status(HttpResponse.Ok).json(shareds);
    } catch (error) {
      response.status(HttpResponse.BadRequest).send(error);
    }
  }

  
}