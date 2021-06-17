import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, Response } from 'express';
import News from '../models/news';
import Like from "../models/like";
import Comment from "../models/comment";
import Post from "../models/post";
import User from "../models/user";
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
        if(resp.draftCopy == false){
          NewsFilter.notificationNewNews(resp)
        }
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
   * Encontrar los streaming
   *
   * @route /v1/news/streaming
   * @method news
   */
     public findNewsStreaming(request: Request, response: Response) {
      News.findNewsStreaming()
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
  public  findOneNews(request: Request, response: Response) {
    News.findOneNews(request.params.id)
    .then( async (news) => {
      if(news){
        let geo = Net.geoIp(Net.ip(request));
                 await NewsFilter.findIpView(request.params.id,geo.ip)
                    response.status(HttpResponse.Ok).json({news})
      } else {
        response.status(HttpResponse.InternalError).send("cannot get news");
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
   * @route /v1/news/:id
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
   * Encontrar Noticias borradas de un usuario
   *
   * @route /v1/news/deleted/:id
   * @method news
   */
  public findMyNewsDeleted(request: Request, response: Response) {
    let user = request.params.id
  News.findMyNewsDeleted(user)
    .then((resp) => {
      response.status(HttpResponse.Ok).json(resp);
    })
    .catch((err) => {
      response.status(HttpResponse.BadRequest).send("cannot-find-news-by-user");
    });
}


/**
   * Encontrar Noticias que son borradores
   *
   * @route /v1/news/draft/:id
   * @method news
   */
 public findMyNewsDraft(request: Request, response: Response) {
  let user = request.params.id
  News.findMyNewsDraft(user)
  .then((resp) => {
    response.status(HttpResponse.Ok).json(resp);
  })
  .catch((err) => {
    response.status(HttpResponse.BadRequest).send("cannot-find-news-by-user");
  });
}

 /**
   * Encontrar Noticias programadas de un usuario
   *
   * @route /v1/news/programated/:id
   * @method news
   */
  public findMyNewsProgramated(request: Request, response: Response) {
    let user = request.params.id
  News.findMyNewsProgramated(user)
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

/**
   * Restaura Noticias 
   *
   * @route /v1/news/restore/:id
   * @method news
   */
 public restoreOneById(request: Request, response: Response) {
  News.restoreOneById(request.params.id)
    .then((resp) => {
      response.status(HttpResponse.Ok).json(resp);
    })
    .catch((err) => {
      response.status(HttpResponse.BadRequest).json(err);
    });
}

/**
   * Reprogramar Noticias 
   *
   * @route /v1/news/rescheduleNews/:id
   * @method news
   */
 public rescheduleNews(request: Request, response: Response) {
  News.rescheduleNews(request.params.id,request.body.date)
    .then((resp) => {
      response.status(HttpResponse.Ok).json(resp);
    })
    .catch((err) => {
      response.status(HttpResponse.BadRequest).json(err);
    });
}


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

  /**
   * Retorna de a 15 reacciones, de cualquier tipo en un news
   */
   public getAllReactionsNews(request: Request, response: Response) {
    // obtenemos el id del news
    let { id } = request.params;
    // obtenemos la paginacion
    let skip = Number(request.params.skip);
    Like.allReactionsNewsUsers(id, skip)
      .then((reactions) => {
        // retornamos las reacciones que encontremos
        response.status(HttpResponse.Ok).json(reactions);
      })
      .catch((err) => {
        // ocurrio un error
        response.status(HttpResponse.BadRequest).send("cannot get reactions");
      });
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



   /**
   * Obtiene cierta cantidad de comentarios en un news
   */

    public async getCommentsInNews(request: Request, response: Response) {
      try {
        // obtenemos el id del news
        let id = request.params.id;
        // paginacion
        let skip = Number(request.params.skip);
        // obtenemos  la cantidad de comentarios
        let comments = await Comment.getCommentsByNews(id, skip);
        // retornamos la cantidad de comentarios
        response.status(HttpResponse.Ok).json(comments);
      } catch (error) {
        // hubo un error
        response.status(HttpResponse.BadRequest).send("something went wrong");
      }
    }



     /**
   * Cuenta el total de cada reaccion en una publicacion
   */

  public countTotalOfEachReactionNews(request: Request, response: Response) {
    // obtenemos el id del post
    let id = request.params.id;
    // buscamos el total de cada reaccion
    Like.countTotalOfEachReactionNews(id)
      .then((data) => {
        // respondemos con la data
        response.status(HttpResponse.Ok).json(data);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot get data");
      });
  }

  /**
   * Retorna de a 15 reacciones, de cualquier de unn tipo en especifico en una noticia
   */
   public getReactionsByTypeInNews(request: Request, response: Response) {
    // obtenemos el id del news
    let { id } = request.params;
    // obtenemos la paginacion
    let skip = Number(request.params.skip);
    // obtenemos el tipo de reaccion
    let type = Number(request.params.type);
    Like.reactionsByTypeNewsUsers(id, type, skip)
      .then((reactions) => {
        // retornamos las reacciones que encontremos
        response.status(HttpResponse.Ok).json(reactions);
      })
      .catch((err) => {
        // ocurrio un error
        response.status(HttpResponse.BadRequest).send("cannot get reactions");
      });
  }
  
}