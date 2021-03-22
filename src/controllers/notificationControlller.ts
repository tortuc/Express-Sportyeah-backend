import { Request, Response } from 'express';
import { HttpResponse } from '../helpers/httpResponse';
import Notification from '../models/notification';
import { BaseController } from './baseController';

/**
 * NotificationController
 * 
 * Explica el objeto de este controlador
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */
 
export class NotificationController extends BaseController
{
    /**
     * El constructor
     */
    public constructor()
    {
        // Llamamos al constructor padre
        super();
    }

  
    getNotifications(request:Request, response:Response){

        Notification.notificationsByUser(request.body.decoded.id)
            .then((notifications)=>{
                response.status(HttpResponse.Ok).json(notifications)
            })
            .catch((err)=>{
                response.status(HttpResponse.InternalError).send('cannot get notifications')
            })
    }


    notificationsUnread(request:Request,response:Response){
        Notification.countNotifications(request.body.decoded.id)
            .then((unreads)=>{
                response.status(HttpResponse.Ok).json(unreads)
            })
            .catch((err)=>{
                response.status(HttpResponse.InternalError).send('cannot get notifications')
            })
    }


    read(request:Request, response:Response){
        Notification.readNotification(request.params.id)
            .then(()=>{
                response.status(HttpResponse.Ok).json({read:true})
            })
            .catch((err)=>{
                response.status(HttpResponse.InternalError).send('cannot read notification')

            })
    }
    readAll(request:Request, response:Response){
        Notification.readAllNotification(request.body.decoded.id)
            .then(()=>{
                response.status(HttpResponse.Ok).json({read:true})
            })
            .catch((err)=>{
                response.status(HttpResponse.InternalError).send('cannot read notifications')

            })
    }

}
