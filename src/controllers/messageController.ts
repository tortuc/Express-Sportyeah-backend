import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, Response } from 'express';
import Message from '../models/message';
import { Socket } from '../helpers/socket';

/**
 * MessageController
 * 
 * Explica el objeto de este controlador
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */
 
export class MessageController extends BaseController
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
     * Guardar mensaje
     * 
     * @route /v1/message/save
     * @method post
     */
    public saveMessage(request:Request, response:Response)
    {
        
        let message = request.body
        message.user = request.body.decoded.id
        delete message.decoded
        Message.createMessage(message)
            .then((msg:any)=>{
                
                Socket.findOneByIdUser(request.body.to)
                    .then((user)=>{
                        Socket.IO.to(user.id).emit('msg',{msg})
                    })
                    .catch((err)=>{
                        console.error(err);         
                    })
                    
                
                Socket.IO.to(msg.chat).emit('new-msg',{msg})
                

                response.status(HttpResponse.Ok).json(msg)
            })
            .catch((err)=>{
                response.status(HttpResponse.InternalError).send("cannot save message")
            })
        
    }

    /**
     * Obtiene todos los mensajes de un chat
     *  
     *  
     */
    public getMessagesByChat(request:Request, response:Response){
        Message.getMessagesFromChat(request.params.id)
            .then((messages)=>{
                response.status(HttpResponse.Ok).json(messages)
            })
            .catch((err)=>{
                response.status(HttpResponse.InternalError).send("cannot get messages")

            })
    }


    public deleteOne(request:Request,response:Response){
        Message.deleteMessage(request.params.id)
            .then((resp)=>{
                response.status(HttpResponse.Ok).send({msg:'deleted'})
            })
            .catch((err)=>{
                response.status(HttpResponse.InternalError).send('cannot delete the message')
            })
    }

    public readMessages(request:Request, response:Response){
        let ids = request.body.messages.map((message)=>{
            return message = message._id
        })

        Message.readMessages(ids)
            .then((messages)=>{
                Socket.IO.to(request.body.chat).emit('reads',{messages:ids})
            })

            response.status(200).send({msg:'read'})
        
    }

}
