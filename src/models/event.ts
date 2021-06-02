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
    // question: Type.objectId({ ref: 'Question', required: false }),
    open    : Type.boolean({default:true}),
    register    : Type.boolean({default:false}),
    importPrice:Type.string({default:null}),
    currency:Type.string({default:null}),
    buyCondition:Type.string({default:null}),
    devolutionCondition:Type.string({default:null}),
    title: Type.string(),
    colorTitle: Type.string(),
    description: Type.string(),
    colorDescription: Type.string(),
    date        : Type.date({default:Date.now}),
    modality: Type.string(),
    principalImage:Type.string(),
    principalVideo:Type.string(),
    audioNews:Type.string(),
    stream  : Type.boolean({default:false}),
    postStream : Type.string({required:false,default:null}),
    pusblishDate    : Type.date({default:Date.now}),
    deleted : Type.boolean({default:false}),
    programatedDate        : Type.date({default:null}),
    programated       : Type.boolean({default:false}),
    edited  : Type.date({defualt:null}),
    views  :[Type.string({default: 0})]
});

const Event = typedModel('Event', schema, undefined, undefined, {
    /**
     * Crea un event
     * @param {Event} event  
     *  
     */
    create(event){
        return new Event(event).save()
    },

    findEvent(){
        return Event
            .find({deleted:false,})
            .populate('user')
            .sort({date:-1})
            //.skip(skip)
            .limit(10)
    },

    findOneEvent(id){
        return Event.findById(id).populate('user')
    },


    /**
     * Obtiene los Event de un deporte
     * 
     * @param sport deporte
     */

    findBySport(sport){
        return Event
            .find({sport,deleted:false,})
            .populate('user')
            .sort({date:-1})
            //.skip(skip)
            .limit(10)
    },
    /**
     * Obtiene los Event de un usuario
     * @param user Id del usuario
     */
    findMyEvent(user){
        
        return Event.find({user,deleted:false})
        .populate('user')
        .sort({date:-1})
        //.skip(skip)
        .limit(10)
    },
      /**
     * Obtiene los Event de un usuario que han sido borradas
     * @param user Id del usuario
     */
    findMyEventDeleted(user){
        
        return Event.find({user,deleted:true})
        .populate('user')
        .sort({date:-1})
        //.skip(skip)
        .limit(10)
    },


        /**
     * Obtiene los Event de un usuario que han sido programados
     * @param user Id del usuario
     */
    findMyEventProgramated(user){
        
        return Event.find({user})
        .populate('user')
        .sort({date:-1})
        //.skip(skip)
        .limit(10)
    },

    updateEvent(id,newValues){
        return Event.findByIdAndUpdate(id,newValues)
    },

    /**
     * Elimina un Event 
     * @param id ID del Event a eliminar
     */
    deleteOneById(id){
        return Event.findByIdAndUpdate(id,{deleted:true})
    },

    /**
     *  Restaura un Event 
     * @param id ID del Event a restaurar
     */
     restoreOneById(id){
        return Event.findByIdAndUpdate(id,{deleted:false})
    },

    /* getCountEventByUser(user){
        return Event.countDocuments({deleted:false,user})
    } */

    getSharedsByEvent(id){
        return Event.find({event:id}).populate('user event').populate({path:'event',populate:{path:'user'}}).sort({date:-1})
    },

    newView(id,ip){
      return  Event.findByIdAndUpdate(id,{$push:{views:ip}})
    },
    findViewIp(id,ip){
        return Event.findOne({_id:id,views:{$elemMatch:{$eq:ip}}})
    },

    rescheduleEvent(id,date){
        return Event.findByIdAndUpdate(id,{programatedDate:date})
    },



});

/**
 * Exporta el modelo
 */
export default Event;
