import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de Notification
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
    user        : Type.objectId({required: true,ref:'User'}),
    action      : Type.string({required:true}),
    friend      : Type.objectId({ref:'User',default:null}),
    post        : Type.objectId({ref:'Post',default:null}),
    comment     : Type.objectId({ref:'Comment',default:null}),
    routerlink  : Type.string({default:null}),
    date        : Type.date({default: Date.now}),
    deleted     : Type.boolean({default:false}),
    read        : Type.boolean({default:false}),
    like        : Type.number({ default: false }),
    question    : Type.objectId({ref:'Question',default:null}),
    news        : Type.objectId({ref:'News',default:null}),
    event       : Type.objectId({ref:'Event',default:null}),
});

const Notification = typedModel('Notification', schema, undefined, undefined, 
    {
        /**
         * Crea una notificacion
         * @param notification 
         */
        newNotification(notification){
            return new Notification(notification).save()
        },
        /**
         * Obtiene todas las notificaciones de un usuario
         * @param user _id del usuario
         */
        notificationsByUser(user,skip){
            return Notification.find({deleted:false,user})
            .populate('user friend post comment')
            .populate({path:'comment',populate:{path:'user'}})
            .sort({date:-1})
            .skip(skip)
            .limit(15);
        },

        /**
         * Notificaciones nuevas
         * 
         * @param user _id del usuario
         */
        countNotifications(user){
            return Notification.countDocuments({deleted:false,read:false,user})
        },
        /**
         * marca una notificacion como vista o leida
         * 
         * @param id _id de la Notificacion
         */
        readNotification(id){
            return Notification.findByIdAndUpdate(id,{read:true})
        },
        /**
         * marca una notificacion como vista o leida
         * 
         * @param id _id del user
         */
        readAllNotification(user){
            return Notification.updateMany({user},{read:true})
        }
    }
);

/**
 * Exporta el modelo
 */
export default Notification;
