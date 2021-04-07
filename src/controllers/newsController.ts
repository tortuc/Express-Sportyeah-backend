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
 * @copyright Sapviremoto
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
    .then((like) => {
      Like.getLikesByNews(like.news)
        .then((likes) => {
          Alert.likeNewsStream(like,like.news);
          response.status(HttpResponse.Ok).json(likes);
        })
        .catch((err) => {
          response
            .status(HttpResponse.InternalError)
            .send("cannot get likes");
        });
    })
    .catch((err) => {
      response.status(HttpResponse.InternalError).send("cannot liked");
    });
}

//dislikes
public dislikeNews(request: Request, response: Response) {
  Like.dislike(request.params.id)
    .then((like) => {
      Like.getLikesByNews(like.news)
        .then((news) => {
          response.status(HttpResponse.Ok).json(news);
        })
        .catch((err) => {
          response
            .status(HttpResponse.InternalError)
            .send("cannot get likes");
        });
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

  
}