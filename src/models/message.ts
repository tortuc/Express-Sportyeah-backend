import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de Message
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 * 
 * @link https://www.npmjs.com/package/ts-mongoose
 */

/**
 * Define el esquema del modelo
 */
const schema = createSchema({
    chat        : Type.objectId({required: true,ref:'Chat'}),
    user        : Type.objectId({required: true,ref:'User'}),
    message     : Type.string(),
    image       : Type.string({default:null}),
    audio       : Type.string({default:null}),
    video       : Type.string({default:null}),
    document    : Type.object({default:null}).of({
                    name: Type.string(),
                    url: Type.string()
                    }),
    date        : Type.date({default: Date.now}),
    deleted     : Type.boolean({default:false}),
    read        : Type.boolean({default:false})
});

const Message = typedModel('Message', schema, undefined, undefined, 
    {
        /**
         * Crea un mensaje
         * 
         * @param {message} message Cuerpo del mensaje
         */
        
        async createMessage(message){
            return new Promise(async (resolve,reject)=>{
                (await new Message(message).save()).populate("user",(err,message)=>{
                
                    if(err){
                        reject('cannot create message')
                    }else{
                        resolve(message) 
                    }
                })
            })
            
        },
        /**
         * Obtiene el ultimo mensaje de un chat 
         * @param {string} chat id del chat
         */
        findLastByChat(chat){
            return Message.find({chat}).sort({date:-1}).limit(1).populate("user")
        },
        /**
         * obtiene todos los mensajes de un chat
         * @param chat id del chat
         */

        getMessagesFromChat(chat){
            return Message.find({chat})
            .sort({date:1})
            .limit(50)
            .populate("user")
        },
        /**
         * Elimina un mensaje
         * @param id 
         */
        deleteMessage(id){
            return Message.findByIdAndUpdate(id,{deleted:true})
        },

        countUnReads(chat,user){
            return Message.countDocuments({chat,read:false,user:{$ne:user}})
        },


        readMessages(messages){
            return Message.updateMany({_id:{$in:messages}},{read:true}).populate("user")
        }
       
    }
);

/**
 * Exporta el modelo
 */
export default Message;
