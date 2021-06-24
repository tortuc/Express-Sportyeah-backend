import { createSchema, Type, typedModel } from 'ts-mongoose';
import { createFalse } from 'typescript';

/**
 * Modelo de conexión
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 * 
 * @link https://www.npmjs.com/package/ts-mongoose
 */

/**
 * Define el esquema del modelo
 */
const schema = createSchema({
    user    : Type.objectId({ref: 'User',required:true}),
    event: Type.objectId({ ref: 'Event', required: true }),
    open    : Type.boolean({default:true}),
    register    : Type.boolean({default:false}),
    importPrice:Type.string({default:null}),
    devolution : Type.boolean({default:false}),
    invited : Type.boolean({default:false}),
    accepted : Type.boolean({default:false}),
    decision : Type.boolean({default:false}),
    date        : Type.date({default:Date.now}),
    deleted : Type.boolean({default:false}),
    edited  : Type.date({defualt:null}),
    views  :[Type.string({default: 0})]
});

const TicketEvent = typedModel('TicketEvent', schema, undefined, undefined, {
    /**
     * Crea un ticketEvent
     * @param {TicketEvent} ticketEvent  
     *  
     */
    create(ticketEvent){
        return new TicketEvent(ticketEvent).save()
    },

    findTicketEvent(id){
        return TicketEvent
            .find({event:id,deleted:false})
            .populate('user')
            .sort({date:-1})
            //.skip(skip)
            .limit(10)
    },

    findTicketEventInvited(id){
        return TicketEvent
            .find({event:id,invited:true,deleted:false})
            .populate('user')
            .sort({date:-1})
            //.skip(skip)
            .limit(10)
    },


    
    findOneTicketEvent(id){
        return TicketEvent.findById(id).populate('user')
    },


    /**
     * Obtiene el ticketEvent de un usuario en cierto evento
     * 
     * @param event id del evento 
     * @param user id del usuario
    */

    findByUserInEvent(event,user){
        return TicketEvent
            .findOne({user,event,deleted:false})
            .populate('user')
            .sort({date:-1})
            //.skip(skip)
            .limit(10)
    },
    /**
     * Obtiene los ticketEvent de un usuario
     * @param user Id del usuario
     */
    findMyTicketEvent(user){
        return TicketEvent.find({user,deleted:false,devolution:false})
        .populate('user event')
        .sort({date:-1})
        //.skip(skip)
        .limit(10)
    },
      /**
     * Obtiene los ticketEvent de un usuario que han sido borradas
     * @param user Id del usuario
     */
    findMyTicketEventDeleted(user){
        
        return TicketEvent.find({user,deleted:true})
        .populate('user')
        .sort({date:-1})
        //.skip(skip)
        .limit(10)
    },


    /**
     * Elimina un ticketEvent  
     * @param id ID del ticketEvent a eliminar
     */
    deleteOneById(id){
        return TicketEvent.findByIdAndUpdate(id,{deleted:true})
    },

    updateTicketEvent(id,newValues){
        return TicketEvent.findByIdAndUpdate(id,newValues)
    },

    
    /**
     *  Restaura un ticketEvent 
     * @param id ID del ticketEvent a restaurar
     */
     restoreOneById(id){
        return TicketEvent.findByIdAndUpdate(id,{deleted:false})
    },

    /**
     * Hace que un ticketEvent sea devolution true o false
     * @param id ID del ticketEvent a eliminar
     */
     devolutionOneById(id,devolution){
        return TicketEvent.findByIdAndUpdate(id,{devolution:!devolution})
    },

    /**
     * Acepta la initación a un evento
     * @param id ID del ticketEvent a editar
     */
    acceptInvitation(id){
        return TicketEvent.findByIdAndUpdate(id,{decision:true,accepted:true})
    },

    /**
     * Acepta la initación a un evento
     * @param id ID del ticketEvent a editar
     */
     deniesInvitation(id){
        return TicketEvent.findByIdAndUpdate(id,{decision:true,accepted:false,devolution:true})
    },

});

/**
 * Exporta el modelo
 */
export default TicketEvent;
