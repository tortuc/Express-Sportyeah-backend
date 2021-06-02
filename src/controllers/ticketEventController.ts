import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, Response } from 'express';
import  TicketEvent  from '../models/ticketEvent'
import { ticketEvent } from '../helpers/ticketHelper'
import { exit } from 'node:process';
/**
 * EventController
 * 
 * Explica el objeto de este controlador
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */
 
export class TicketEventController extends BaseController
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
     * Crea un ticketEvento
     * 
     * @route /ticketEvent/
     * @method post
     */
     public async createTicketEvent(request:Request, response:Response)
    {
        await  TicketEvent.findByUserInEvent(request.body.event,request.body.user)
        .then((exist)=>{
           if(!exist) {
            TicketEvent.create(request.body)
            .then((resp)=>{
                response.status(HttpResponse.Ok).json(resp);
            })
            .catch((err)=>{
                response.status(HttpResponse.BadRequest).json(err);
            })
           }else{
            response.status(HttpResponse.Ok).json({ticket:'exist'});
           }
          }) 
    }

      /**
     * Encuentra los ticketEvento por evento
     * 
     * @route /ticketEvent/
     * @method post
     */
       public findTicketEvent(request:Request, response:Response)
       {
        TicketEvent.findTicketEvent(request.params.id).then((resp)=>{
               response.status(HttpResponse.Ok).json(resp);
           })
           .catch((err)=>{
               response.status(HttpResponse.BadRequest).json(err);
           })
       }

    /**
     * Encuentra un ticketEvento
     * 
     * @route /ticketEvent/
     * @method post
     */
        public findOneTicketEvent(request:Request, response:Response)
        {
            TicketEvent.findOneTicketEvent(request.params.id).then((resp)=>{
                response.status(HttpResponse.Ok).json(resp);
            })
            .catch((err)=>{
                response.status(HttpResponse.BadRequest).json(err);
            })
        }

        
    /**
     * Encuentra los ticketEvento de un usuario
     * 
     * @route /ticketEvent/
     * @method get
     */
     public findMyTicketEvent(request:Request, response:Response)
     {
        TicketEvent.findMyTicketEvent(request.params.id).then((resp)=>{
             response.status(HttpResponse.Ok).json(resp);
         })
         .catch((err)=>{
             response.status(HttpResponse.BadRequest).json(err);
         })
     }
     

     /**
     * Encuentra los ticketEvento de un usuario en cierto evento
     * 
     * @route /ticketEvent/
     * @method get
     */
      public findByUserInEvent(request:Request, response:Response)
      {
         TicketEvent.findByUserInEvent(request.params.event,request.params.user).then((resp)=>{
              response.status(HttpResponse.Ok).json(resp);
          })
          .catch((err)=>{
              response.status(HttpResponse.BadRequest).json(err);
          })
      }



          
    /**
     * Edita un ticketEvento
     * 
     * @route /ticketEvent/
     * @method put
     */
     public updateTicketEvent(request:Request, response:Response)
     {
        TicketEvent.updateTicketEvent(request.params.id,request.body).then((resp)=>{
             response.status(HttpResponse.Ok).json(resp);
         })
         .catch((err)=>{
             response.status(HttpResponse.BadRequest).json(err);
         })
     }


     /**
     * Elimina un ticketEvento
     * 
     * @route /ticketEvent/
     * @method put
     */
      public deleteOneById(request:Request, response:Response)
      {
        TicketEvent.deleteOneById(request.params.id).then((resp)=>{
              response.status(HttpResponse.Ok).json(resp);
          })
          .catch((err)=>{
              response.status(HttpResponse.BadRequest).json(err);
          })
      }


      /**
     * Cambiael estado de devolution en un ticketEvento
     * 
     * @route /ticketEvent/devolution
     * @method put
     */
       public devolutionOneById(request:Request, response:Response)
       {
         TicketEvent.devolutionOneById(request.params.id,request.body.devolution).then((resp)=>{
               response.status(HttpResponse.Ok).json(resp);
           })
           .catch((err)=>{
               response.status(HttpResponse.BadRequest).json(err);
           })
       }
}
