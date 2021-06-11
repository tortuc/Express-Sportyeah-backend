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
 * @copyright Retail Servicios Externos SL
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
   // cantidad de notificaciones a saltar, para hacer la paginacion
    let skip = Number(request.params.skip);
    // busca las notificaciones de ese usuario
        Notification.notificationsByUser(request.body.decoded.id, skip)
            .then((notifications)=>{
                response.status(HttpResponse.Ok).json(notifications)
            })
            .catch((err)=>{
                response.status(HttpResponse.InternalError).send('cannot get notifications')
            })
    }

    /**
   * Retorna la cantidad de notifcaciones que el usuario no ha leido o visto
   * @param request
   * @param response
   */

    notificationsUnread(request:Request,response:Response){
        Notification.countNotifications(request.body.decoded.id)
            .then((unreads)=>{
                response.status(HttpResponse.Ok).json(unreads)
            })
            .catch((err)=>{
                response.status(HttpResponse.InternalError).send('cannot get notifications')
            })
    }

    /**
   * Marcar una notificacion como leida
   * @param request
   * @param response
   */
    read(request:Request, response:Response){
        Notification.readNotification(request.params.id)
            .then(()=>{
                response.status(HttpResponse.Ok).json({read:true})
            })
            .catch((err)=>{
                response.status(HttpResponse.InternalError).send('cannot read notification')

            })
    }

    /**
   * Marcar todas las notifiaciones como leidas
   * @param request
   * @param response
   */
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
