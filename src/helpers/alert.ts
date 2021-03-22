/**
 * Clase Alert
 * 
 * Contiene métodos útiles para mandar notificaciones a usuarios
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 * 
 */

import { match } from "assert";
import Comment from "../models/comment";
import Like from "../models/like";
import Notification from "../models/notification";
import Post from "../models/post";
import User from "../models/user";
import { Config } from "./config";
import { Environment } from "./environment";
import { Socket } from "./socket";
export class Alert
{
    /**
     * El constructor
     */
    private constructor()
    {
        // Constructor Privado
    }

    /**
     * Avisa que tiene una nueva notificacion
     * 
     */
    public static notification(user):void
    {
      Socket.findOneByIdUser(user)
        .then((user)=>{
            Socket.IO.to(user.id).emit('notification')
        }).catch((err)=>{
            
            
        })
    }



  

    public static likeNotification(like){
        
        Like.getLike(like._id)
            .then((like)=>{
                let post:any = like.post
                let user:any = like.user
                let type:any = like.type

                if(user._id+'' != post.user+''){
                    Notification.newNotification({
                        user:post.user,
                        post:post._id,
                        friend:user._id,
                        action:'like',
                        like:type,
                        routerlink:`/post/${post._id}`
    
                    })
                    .then(()=>{
                        this.notification(user._id)
                    })
                    .catch((err)=>{
                        
                        
                    })
                }
        
            })
        
    }

    public static commentAlert(comment){
        Comment.getOneComment(comment._id)
            .then((comment)=>{
                let post:any = comment.post
                let user:any = comment.user
                if(user._id+'' != post.user+''){
                Notification.newNotification({
                    user:post.user,
                    post:post._id,
                    comment:comment._id,
                    friend:user._id,
                    action:'comment',
                    routerlink:`/post/${post._id}`

                }).then(()=>{
                    this.notification(user._id)
                })
                .catch((err)=>{
                    // handle err
                })
            }
            })
            .catch((err)=>{
                // handle err
            })
    }


    public static sharedNotification(post){
        let friend = post.user
        let idPost = post._id
        Post.findOnePost(idPost)
            .then((post)=>{
                let dataPost:any = post.post
                let user = dataPost.user._id
                if(user+'' != friend+''){
                    Notification.newNotification({
                        user,
                        post:idPost,
                        friend,
                        routerlink:`/post/${idPost}`,
                        action:'shared'
                    })
                    .then(()=>{
                        this.notification(user)
                    })
                    .catch((err)=>{
                        // handle
                    })
                }
              
                
            })
    }
    
    public static mentionsPost(post){
        let friend = post.user
        let message:string = post.message
        let matchs = message.match(/href="\/#\/user\/[a-zA-z0-9]*"/g)
        if(matchs != null){
            matchs.forEach((match)=>{
                let username = match.split("/")[3].replace('"','')
                User.findByUsername(username)
                    .then((user)=>{

                        //aqui para las analiticas De las menciones
                        Notification.newNotification({
                            user:user._id,
                            friend,
                            action:'mention',
                            routerlink:`/post/${post._id}`,
                            post:post._id
                        })
                            .then(()=>{
                                this.notification(user._id)
                            })
                            .catch((err)=>{
                                // handle
                            })
                    })
                
            })
        }
     
        
    }   

    public static mentionsComment(comment){
        let friend = comment.user
        let message:string = comment.message
        let matchs = message.match(/href="\/#\/user\/[a-zA-z0-9]*"/g)
        let post = comment.post
        if(matchs != null){
            matchs.forEach((match)=>{
                let username = match.split("/")[3].replace('"','')
                User.findByUsername(username)
                    .then((user)=>{
                         //aqui para las analiticas De las menciones
                        Notification.newNotification({
                            user:user._id,
                            friend,
                            action:'mention_comment',
                            routerlink:`/post/${post}`,
                            post:post
                        })
                            .then(()=>{
                                this.notification(user._id)
                            })
                            .catch((err)=>{
                                // handle
                            })
                    })
                
            })
        }
       
    }
    
    public static likeNewsStream(like,idNews){
    
    Socket.IO.in(`${idNews}`).emit('new-reaction',{like})
        
    }
    public static commentNewsStream(comment,idNews){
        Socket.IO.in(`${idNews}`).emit('new-comment',{comment})
            
        }
}
