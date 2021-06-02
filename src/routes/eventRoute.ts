import { EventController } from '../controllers/eventController';

/**
 * exampleRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const eventController = new EventController();

/**
 * Habilita el Router
 */
const EventRouter:any = eventController.router();

/**
 * Crear una evento
 * 
 * 
 * @route /v1/event/create
 * @method post
 */
 EventRouter.post('/create', eventController.createEvent);



 /**
 * encuentra todos los eventos
 * 
 * 
 * @route /v1/event/
 * @method get
 */
  EventRouter.get('/', eventController.findEvent);


 /**
 * encuentra un evento 
 * 
 * 
 * @route /v1/event/one
 * @method get
 */
  EventRouter.get('/one/:id', eventController.findOneEvent);


 /**
 * encuentra todos los eventos de un usuario
 * 
 * 
 * @route /v1/event/my/:id
 * @method get
 */
   EventRouter.get('/my/:id', eventController.findMyEvent);

 /**
 * edita un evento
 * 
 * 
 * @route /v1/event/edit/:id
 * @method put
 */
  EventRouter.put('/edit/:id', eventController.updateEvent);

/**
 * elimina un evento
 * 
 * 
 * @route /v1/event/delete/:id
 * @method delete
 */
    EventRouter.delete('/delete/:id', eventController.deleteOneById);


    

module.exports = EventRouter;
