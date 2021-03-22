import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de Chat
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
    sender    : Type.objectId({required: true,ref:'User'}),
    receiver  : Type.objectId({required: true,ref:'User'}),
    date    : Type.date({default: Date.now})
});

const Chat = typedModel('Chat', schema, undefined, undefined, 
    {
        /**
         * Obtiene un chat donde el usuario y el amigo que selecciono sean el sender y receiver o viceversa
         * 
         * @param {string} sender El id del usuario
         * @param {string} receiver El id del amigo
         */
        findChat(sender,receiver){
            return Chat.findOne({
                sender:{$in:[sender,receiver]},
                receiver:{$in:[sender,receiver]}
            }).populate("sender receiver")
        },
        /**
         * Busca un chat donde el usuario y su amigo sean el sender y receiver 
         * @param sender id del sender 
         * @param receiver id del reciver
         */
        async createChat(sender,receiver){
            return new Promise(async (resolve,reject)=>{
                (await new Chat({sender,receiver}).save()).populate("sender receiver",(err,chat)=>{
                    if(err){
                        reject('cannot create chat')
                    }else{
                        resolve(chat)
                    }
                })
            })
       },
        /**
         * Retorna todos los chats donde el usuario sea sender o receiver
         * @param user id del usuario
         */
        getChatsByUser(user){
            return Chat.find({$or:[{sender:user},{receiver:user}]}).populate("sender receiver")
        }
        
    }
);

/**
 * Exporta el modelo
 */
export default Chat;
