import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, Response } from 'express';
import  Event  from '../models/event'
import { ticketEvent } from '../helpers/ticketHelper';
/**
 * EventController
 * 
 * Explica el objeto de este controlador
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */
 
export class EventController extends BaseController
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
     * Crea un evento
     * 
     * @route /event/
     * @method post
     */
    public createEvent(request:Request, response:Response)
    {
        Event.create(request.body).then((resp)=>{
            response.status(HttpResponse.Ok).json(resp);
        })
        .catch((err)=>{
            response.status(HttpResponse.BadRequest).json(err);
        })
    }

      /**
     * Encuentra todos los eventos
     * 
     * @route /event/
     * @method post
     */
       public findEvent(request:Request, response:Response)
       {
           Event.findEvent().then((resp)=>{
               response.status(HttpResponse.Ok).json(resp);
           })
           .catch((err)=>{
               response.status(HttpResponse.BadRequest).json(err);
           })
       }

    /**
     * Encuentra un evento
     * 
     * @route /event/
     * @method post
     */
        public findOneEvent(request:Request, response:Response)
        {
            Event.findOneEvent(request.params.id).then((resp)=>{
                response.status(HttpResponse.Ok).json(resp);
            })
            .catch((err)=>{
                response.status(HttpResponse.BadRequest).json(err);
            })
        }

        
    /**
     * Encuentra todos los eventos de un usuario
     * 
     * @route /event/
     * @method get
     */
     public findMyEvent(request:Request, response:Response)
     {
         Event.findOneEvent(request.params.id).then((resp)=>{
             response.status(HttpResponse.Ok).json(resp);
         })
         .catch((err)=>{
             response.status(HttpResponse.BadRequest).json(err);
         })
     }


          
    /**
     * Edita un evento
     * 
     * @route /event/
     * @method put
     */
     public updateEvent(request:Request, response:Response)
     {
         Event.updateEvent(request.params.id,request.body).then((resp)=>{
             response.status(HttpResponse.Ok).json(resp);
         })
         .catch((err)=>{
             response.status(HttpResponse.BadRequest).json(err);
         })
     }


     /**
     * Elimina un evento
     * 
     * @route /event/
     * @method put
     */
      public deleteOneById(request:Request, response:Response)
      {
          Event.deleteOneById(request.params.id).then((resp)=>{
              ticketEvent.deleteTicketsEvent(request.params.id)
              response.status(HttpResponse.Ok).json(resp);
          })
          .catch((err)=>{
              response.status(HttpResponse.BadRequest).json(err);
          })
      }
}
