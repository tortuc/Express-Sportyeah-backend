import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, response, Response } from 'express';
import Chat from '../models/chat';
import Message from '../models/message';

/**
 * ChatController
 * 
 * Explica el objeto de este controlador
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */
 
export class ChatController extends BaseController
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
     * Verifica si ya existe un chat entre dos personas, si no existe se crea
     * 
     * @route /v1/chat/create
     * @method post
     */
    public create(request:Request, response:Response)
    {
        
        Chat.findChat(request.body.decoded.id,request.body.user)
            .then((chat)=>{
                
                if(chat){
                    response.status(HttpResponse.Ok).json(chat)
                    
                }else{
                    Chat.createChat(request.body.decoded.id,request.body.user)
                        .then((chat)=>{
                            response.status(HttpResponse.Ok).json(chat)
                        })
                        .catch((err)=>{
                            response.status(HttpResponse.InternalError).send("cannot create chat")
                        })
                }
            })
            .catch((err)=>{
                response.status(HttpResponse.InternalError).send("cannot get chat")
                
            })
    }

    /**
     * Retorna los chats de un usuario 
     * el id del usuario viene en el `request.body.decoded.id` que viene en el token del jwt
     * 
     * @route /v1/chat/user
     * 
     */
    findChats(request:Request, response:Response){
        Chat.getChatsByUser(request.body.decoded.id)
            .then((chats)=>{
                let chatsLastMessage = []
                let j = 0
                if(chats.length === 0){
                  response.status(HttpResponse.Ok).json([])
                }else{
                  chats.forEach((chat,i,arr)=>{
                      Message.findLastByChat(chat._id)
                          .then((last)=>{
                             Message.countUnReads(chat._id,request.body.decoded.id)
                              .then((unreads)=>{
                                  
                                  chatsLastMessage.push({
                                      chat,
                                      lastMessage:last[0] || null,
                                      unreads
                                  })
                                  j += 1 // este iterador se suma soloo despues que se pusheo el chat
                                  if(j == arr.length){  
                                            
                                      chatsLastMessage.sort((a,b)=>{
                                          return b.lastMessage?.date.getTime() - a.lastMessage?.date.getTime()
                                        })                        
                                      response.status(HttpResponse.Ok).json(chatsLastMessage)
                                  }
                                
                              })
                              .catch((err)=>{
                                  
                                  
                                  response.status(HttpResponse.InternalError).send("cannot get unreads")
  
                              })
                              
                          })
                          .catch((err)=>{
                              response.status(HttpResponse.InternalError).send("cannot get last")
  
                          })
                  })
                }
            })
            .catch((err)=>{
                response.status(HttpResponse.InternalError).send("cannot get chats")
                
            })
    }
}
