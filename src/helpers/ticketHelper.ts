/**
 * Clase ticketEvent
 *
 * Se usa para filtrar los usuarios que ya se han registrado en un evento
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 *
 */

import Event from '../models/event'
import TicketEvent from '../models/ticketEvent'

export class ticketEvent {
   private constructor() {
     // Constructor Privado
   }


// static async findUserRegister(event){
//   await  TicketEvent.findByUserInEvent(event.event,event.user)
//     .then((response)=>{
//       return response
//       }) 
//     .catch((err)=>{return err})
// }
static deleteTicketsEvent(eventId){
  TicketEvent.findTicketEvent(eventId).then((response)=>{
    let tickets = response 
    console.log(response);
    for(let ticket of tickets){
      TicketEvent.deleteOneById(ticket._id).then((response)=>{
        console.log('ok');
      })
      .catch((err)=>console.log(err))
    }
    return true
  })
  .catch(err => console.log(err))
}

}