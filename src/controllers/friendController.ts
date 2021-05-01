import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, Response } from 'express';
import Friend from '../models/friend';
import { NotificationController } from './notificationControlller';
import Notification from '../models/notification';
import { Socket } from '../helpers/socket';
import { Alert } from '../helpers/alert';
import User from "../models/user";

/**
 * FriendController
 * 
 * Explica el objeto de este controlador
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */
 
export class FriendController extends BaseController
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
     * Obtiene a los seguidores
     * 
     * @route /friend/followers
     * @method get
     */
    public followers(request:Request, response:Response)
    {
        Friend.findFollowers(request.body.decoded.id)
        .then((followers)=>{
            response.status(HttpResponse.Ok).json(followers)
        })
        .catch((err)=>{
            response.status(HttpResponse.BadRequest).send("cannot get followers")

        })    }

     /**
     * Obtiene a los suguiendo 
     * 
     * @route /friend/followings
     * @method get
     */
   

     /**
     * Obtiene a los suguiendo 
     * 
     * @route /friend/followings
     * @method get
     */
    public following(request:Request, response:Response)
    {
        Friend.findFollowing(request.body.decoded.id)
        .then((followings) => {
          response.status(HttpResponse.Ok).json(followings);
        })
        .catch((err) => {
          response.status(HttpResponse.BadRequest).send("cannot get followings");
        });
    }

  


  

    /**
     * Seguir a un amigo
     * El follower (Seguidor) es el usuario que da a seguir por lo tanto se obtiene del token -> `request.body.decoded.id`
     * El user es el usuario a quien vamos a seguir por lo tanto se recibe por el body como `user`
     *  
     */
    public newFollower(request:Request, response:Response){
        let friend = {
            follower: request.body.decoded.id,
            user: request.body.user,
          };
          Friend.newFollower(friend)
            .then((following) => {
              Notification.newNotification({
                user: following.user,
                friend: following.follower,
                action: "follow",
              }).then(() => {
                Alert.notification(friend.user);
              });
              User.populate([following], { path: "user" }, (err, data) => {
                if (err) {
                  response
                    .status(HttpResponse.BadRequest)
                    .send("Cannot get new friend");
                } else {
                  response.status(HttpResponse.Ok).json(data[0]);
                }
              });
            })
            .catch((err) => {
              console.log(err);
      
              response
                .status(HttpResponse.BadRequest)
                .send("Cannot follow new friend");
            });
    }

    public unFollow(request:Request, response:Response){
       // obtenemos el id de FRIEND para marcarlo como falso
        let id = request.params.id;
        Friend.unFollow(id)
      .then((friend) => {
        // notificamos al usuario que lo dejaron de seguir
        Notification.newNotification({
          user: friend.user,
          friend: friend.follower,
          action: "unfollow",
        }).then(() => {
          Alert.notification(friend.user);
        });

        response.status(HttpResponse.Ok).json(friend);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot unfollow user");
      });
    }

 
 /**
   * Buscar usuarios por una consulta
   * @param request
   * @param response
   */
  public searchUserQuery(request: Request, response: Response) {
    // obtenemos la query
    let query = request.params.query;
    // busca a los usuarios por la query
    User.searchQueryUsers(query)
      .then((users) => {
        User.populate(users, { path: "_id" }).then((users) => {
          users = users.map((user) => {
            return user._id;
          });
          response.status(HttpResponse.Ok).json(users);
        });
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }

  /**
   * busca a usuarios de kecuki, por una cadena de texto
   */
  public searchUserQuerySkip(request: Request, response: Response) {
    let query = request.params.query; // obtenemos la busqueda o el texto que ingreso el usuario
    let skip = Number(request.params.skip); // obtenemos la paginacion y la convertimos a numero
    // buscamos a los usuarios que coincidan con la busqueda
    User.searchQueryUsers(query, 15, skip)
      .then((users) => {
        // hacemos el populate de los usuarios para obtener su data
        User.populate(users, { path: "_id" }).then((users) => {
          users = users.map((user) => {
            return user._id;
          });
          response.status(HttpResponse.Ok).json(users);
        });
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }

}
