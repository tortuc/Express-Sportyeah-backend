import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, Response } from 'express';
import Friend from '../models/friend';
import { NotificationController } from './notificationControlller';
import Notification from '../models/notification';
import { Socket } from '../helpers/socket';
import { Alert } from '../helpers/alert';

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
                
            Friend.findFollowersOnlyId(request.body.decoded.id)
                .then((ids)=>{
                    response.status(HttpResponse.Ok).json({
                        followers,
                        ids
                    })
                })
                .catch((err)=>{

                    response.status(HttpResponse.BadRequest).send("cannot get followers")
                })
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
     * Obtiene a los seguidores por id
     * 
     * @route /friend/followers/:id
     * @method get
     */
    public followersById(request:Request, response:Response)
    {
        Friend.findFollowers(request.params.id)
        .then((followers)=>{
                
            Friend.findFollowersOnlyId(request.params.id)
                .then((ids)=>{
                    response.status(HttpResponse.Ok).json({
                        followers,
                        ids
                    })
                })
                .catch((err)=>{

                    response.status(HttpResponse.BadRequest).send("cannot get followers")
                })
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
    public following(request:Request, response:Response)
    {
        Friend.findFollowing(request.body.decoded.id)
            .then((followings)=>{
                
                Friend.findFollowingOnlyId(request.body.decoded.id)
                    .then((ids)=>{
                        response.status(HttpResponse.Ok).json({
                            followings,
                            ids
                        })
                    })
                    .catch((err)=>{

                        response.status(HttpResponse.BadRequest).send("cannot get followings")
                    })
            })
            .catch((err)=>{
                response.status(HttpResponse.BadRequest).send("cannot get followings")

            })
    }

     /**
     * Obtiene a los suguiendo por id de usuario
     * 
     * @route /friend/followings/:id
     * @method get
     */
    public followingById(request:Request, response:Response)
    {
        Friend.findFollowing(request.params.id)
            .then((followings)=>{
                
                Friend.findFollowingOnlyId(request.params.id)
                    .then((ids)=>{
                        response.status(HttpResponse.Ok).json({
                            followings,
                            ids
                        })
                    })
                    .catch((err)=>{

                        response.status(HttpResponse.BadRequest).send("cannot get followings")
                    })
            })
            .catch((err)=>{
                response.status(HttpResponse.BadRequest).send("cannot get followings")

            })
    }


  

    /**
     * Seguir a un amigo
     * El follower (Seguidor) es el usuario que da a seguir por lo tanto se obtiene del token -> `request.body.decoded.id`
     * El user es el usuario a quien vamos a seguir por lo tanto se recibe por el body como `user`
     *  
     */
    public newFollower(request:Request, response:Response){
        let friend = { 
            follower:request.body.decoded.id,
            user:request.body.user
        }
        Friend.newFollower(friend)
            .then((following)=>{
        
                Notification.newNotification({
                    user:following.user,
                    friend:following.follower,
                    action:'follow'
                }).then(()=>{
                    Alert.notification(friend.user)

                })

                response.status(HttpResponse.Ok).json(following)
            })
            .catch((err)=>{
                response.status(HttpResponse.BadRequest).send("Cannot follow new friend")
            })
    }

    public unFollow(request:Request, response:Response){
        Friend.unFollow(request.params.id)
            .then((friend)=>{
                
                Notification.newNotification({
                    user:friend.user,
                    friend:friend.follower,
                    action:'unfollow'
                }).then(()=>{
                    Alert.notification(friend.user)
                   
                })


                response.status(HttpResponse.Ok).json(friend)
            })
            .catch((err)=>{
                response.status(HttpResponse.BadRequest).send("cannot unfollow user")
            })
    }

 

  
}
