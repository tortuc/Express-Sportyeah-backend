import { TicketEventController } from '../controllers/ticketEventController';

/**
 * exampleRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const ticketEventController = new TicketEventController();

/**
 * Habilita el Router
 */
const TicketEventRouter:any = ticketEventController.router();

/**
 * Crear una ticketevent
 * 
 * 
 * @route /v1/ticketevent/create
 * @method post
 */
 TicketEventRouter.post('/create', ticketEventController.createTicketEvent);



 /**
 * encuentra todos los ticketevent de un evento por id
 * 
 * 
 * @route /v1/ticketevent/
 * @method get
 */
  TicketEventRouter.get('/:id', ticketEventController.findTicketEvent);

  /**
 * encuentra todos los ticketevent de un evento por id
 * 
 * 
 * @route /v1/ticketevent/invited/:id
 * @method get
 */
   TicketEventRouter.get('/invited/:id', ticketEventController.findTicketEventInvited);


 /**
 * encuentra un ticketevent 
 * 
 * 
 * @route /v1/ticketevent/one
 * @method get
 */
  TicketEventRouter.get('/one/:id', ticketEventController.findOneTicketEvent);


 /**
 * encuentra todos los ticketevent de un usuario
 * 
 * 
 * @route /v1/ticketevent/my/:id
 * @method get
 */
   TicketEventRouter.get('/my/:id', ticketEventController.findMyTicketEvent);

 /**
 * encuentra todos los ticketevent de un usuario
 * 
 * 
 * @route /v1/ticketevent/ticket/:event/:user
 * @method get
 */
  TicketEventRouter.get('/ticket/:event/:user', ticketEventController.findByUserInEvent);

 /**
 * edita un ticketevent
 * 
 * 
 * @route /v1/ticketevent/edit/:id
 * @method put
 */
  TicketEventRouter.put('/edit/:id', ticketEventController.updateTicketEvent);

/**
 * elimina un ticketevent
 * 
 * 
 * @route /v1/event/delete/:id
 * @method delete
 */
    TicketEventRouter.put('/delete/:id', ticketEventController.deleteOneById);

/**
 * cambia de devolution a un ticketevent
 * 
 * 
 * @route /v1/event/devolution
 * @methodp put
 */
 TicketEventRouter.put('/devolution/:id', ticketEventController.devolutionOneById);

 /**
 * Acepta un evento 
 * 
 * 
 * @route /v1/event/accept
 * @methodp put
 */
 TicketEventRouter.put('/accept/:id', ticketEventController.acceptInvitation);

 /**
 * cambia de devolution a un ticketevent
 * 
 * 
 * @route /v1/event/denies
 * @methodp put
 */
  TicketEventRouter.put('/denies/:id', ticketEventController.deniesInvitation);


module.exports = TicketEventRouter;
