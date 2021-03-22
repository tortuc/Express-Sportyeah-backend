import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import Post from "../models/post";
import Like from "../models/like";
import Comment from "../models/comment";
import User from "../models/user";
import { Alert } from "../helpers/alert";

/**
 * PostController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
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
        response.status(HttpResponse.Ok).json(resp);
        if (resp.post != null) {
          Alert.sharedNotification(resp);
        }
        Alert.mentionsPost(resp);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot-create");
      });
  }

  public getMyPosts(request: Request, response: Response) {
    User.findById(request.body.decoded.id)
      .then((user) => {
        let regex = `/user/${user.username}`;
        let skip = Number(request.params.skip);
        Post.findMyPosts(request.body.decoded.id, regex, skip)
          .then((posts) => {
            let postsAndLikes = [];
            let j = 0;
            if(posts.length===0){
              response
              .status(HttpResponse.Ok)
              .json([]);
            }else{
              posts.forEach((post, i, arr) => {
                Like.getLikesByPost(post._id)
                  .then((likes) => {
                    Comment.getCommentsByPost(post._id)
                      .then((comments) => {
                        Post.getSharedsByPost(post._id)
                          .then((shareds) => {
                            postsAndLikes.push({
                              post,
                              likes,
                              comments,
                              shareds,
                            });
                            j++;
                            if (j == arr.length) {
                              postsAndLikes.sort((a, b) => {
                                return (
                                  b.post.date.getTime() - a.post.date.getTime()
                                );
                              });
                              response
                                .status(HttpResponse.Ok)
                                .json(postsAndLikes);
                            }
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
              });
            }
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
    // los id vienen en el body friends_id
    let ids: any[] = request.body.friends_id;
    /**
     *  Se hace un map para poder obtener solo los id de los usuarios, ya que este llega como un objeto
     *  donde viene el _id del registro de Friend y el _id del User
     */

    ids = await ids.map((id) => {
      return (id = id.user);
    });
    /**
     * una vez formateado los id de los usuarios, le agregamos el id del usuario que esta haciendo la peticion
     * para tambien obtener sus post
     */
    ids.push(request.body.decoded.id);
    Post.findByFriends(ids, skip).then((posts) => {
      let postsAndLikes = [];
      let j = 0;
      if (posts.length == 0) {
        response.status(HttpResponse.Ok).json(postsAndLikes);
      } else {
        posts.forEach((post, i, arr) => {
          Like.getLikesByPost(post._id).then((likes) => {
            Comment.getCommentsByPost(post._id)
              .then((comments) => {
                Post.getSharedsByPost(post._id)
                  .then((shareds) => {
                    postsAndLikes.push({
                      post,
                      likes,
                      comments,
                      shareds,
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
                      .send("cannot get shareds");
                  });
              })
              .catch((err) => {
                response
                  .status(HttpResponse.InternalError)
                  .send("cannot get comments");
              });
          });
        });
      }
    });
  }

  public findByUser(request: Request, response: Response){
    
    let user = request.params.id
    Post.findByUser(user)
    .then((posts) => {
      let postsAndLikes = [];
      let j = 0;
      if (posts.length == 0) {
        response.status(HttpResponse.Ok).json(postsAndLikes);
      } else {
        posts.forEach((post, i, arr) => {
          Like.getLikesByPost(post._id).then((likes) => {
            Comment.getCommentsByPost(post._id)
              .then((comments) => {
                Post.getSharedsByPost(post._id)
                  .then((shareds) => {
                    postsAndLikes.push({
                      post,
                      likes,
                      comments,
                      shareds,
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
                      .send("cannot get shareds");
                  });
              })
              .catch((err) => {
                response
                  .status(HttpResponse.InternalError)
                  .send("cannot get comments");
              });
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

  public likePost(request: Request, response: Response) {
    let like = {
      user: request.body.decoded.id,
      post: request.params.id,
      type: request.body.id_reaction,
    };
    Like.addLike(like)
      .then((like) => {
        Like.getLikesByPost(like.post)
          .then((likes) => {
            response.status(HttpResponse.Ok).json(likes);
            Alert.likeNotification(like);
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
  public dislikePost(request: Request, response: Response) {
    Like.dislike(request.params.id)
      .then((like) => {
        Like.getLikesByPost(like.post)
          .then((likes) => {
            response.status(HttpResponse.Ok).json(likes);
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

  public getPost(request: Request, response: Response) {
    Post.findOnePost(request.params.id)
      .then((post) => {
        if (post) {
          Like.getLikesByPost(post._id)
            .then((likes) => {
              Comment.getCommentsByPost(post._id)
                .then((comments) => {
                  Post.getSharedsByPost(post._id)
                    .then((shareds) => {
                      response.status(HttpResponse.Ok).json({
                        post,
                        likes,
                        comments,
                        shareds,
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
                    .send("cannot get likes");
                });
            })
            .catch((err) => {
              response
                .status(HttpResponse.InternalError)
                .send("cannot get likes");
            });
        } else {
          response.status(HttpResponse.InternalError).send("cannot get post");
        }
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("cannot get post");
      });
  }

  public newComment(request: Request, response: Response) {
    let comment = {
      user: request.body.decoded.id,
      post: request.body.post,
      message: request.body.message,
      image: request.body.image,
    };
    Comment.newComment(comment)
      .then((comment) => {
        Comment.getCommentsByPost(comment.post)
          .then((comments) => {
            response.status(HttpResponse.Ok).json(comments);
            Alert.commentAlert(comment);
            Alert.mentionsComment(comment);
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

  public getPostsByUserId(request: Request, response: Response) {
    User.findById(request.params.id).then((user) => {
      let regex = `/user/${user.username}`;
      let skip = Number(request.params.skip);
      Post.findMyPosts(request.params.id, regex, skip)
        .then((posts) => {
          let postsAndLikes = [];
          let j = 0;
          if(posts.length === 0){
            response.status(HttpResponse.BadRequest).send("unknow error");
          }else{
            
            posts.forEach((post, i, arr) => {
              Like.getLikesByPost(post._id)
                .then((likes) => {
                  Comment.getCommentsByPost(post._id)
                    .then((comments) => {
                      Post.getSharedsByPost(post._id)
                        .then((shareds) => {
                          postsAndLikes.push({
                            post,
                            likes,
                            comments,
                            shareds,
                          });
                          j++;
                          if (j == arr.length) {
                            postsAndLikes.sort((a, b) => {
                              return (
                                b.post.date.getTime() - a.post.date.getTime()
                              );
                            });
                            response.status(HttpResponse.Ok).json(postsAndLikes);
                          }
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
            });
          }
        })
        .catch((err) => {
          response.status(HttpResponse.BadRequest).send("unknow error");
        });
    });
  }

  public getSharedsByPost(request: Request, response: Response) {
    Post.getSharedsByPost(request.params.id)
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


  public findAllPost(request: Request, response:Response){
    Post.findAllPost()
    .then((posts) => {
      //response.status(HttpResponse.Ok).json(posts)
       let postsAndLikes = [];
      let j = 0;
      if (posts.length == 0) {
        response.status(HttpResponse.Ok).json(postsAndLikes);
      } else {
        posts.forEach((post, i, arr) => {
          Like.getLikesByPost(post._id).then((likes) => {
            Comment.getCommentsByPost(post._id)
              .then((comments) => {
                Post.getSharedsByPost(post._id)
                  .then((shareds) => {
                    postsAndLikes.push({
                      post,
                      likes,
                      comments,
                      shareds,
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
                      .send("cannot get shareds");
                  });
              })
              .catch((err) => {
                response
                  .status(HttpResponse.InternalError)
                  .send("cannot get comments");
              });
          });
        });
      } 
    });
  }

  

}
