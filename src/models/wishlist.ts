import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de WishList
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
    user    : Type.objectId({default: null,ref:'User'}),
    // event  : Type.string({required: true}),
    date    : Type.date({default: Date.now})

});

const WishList = typedModel('Wishlist', schema, undefined, undefined, 
    {
        /**
         * Crea una lista de deseos
         * @param user `_id` User
         * @param event `_id` Event
         */
      createOne(user = null,event = null){
          if(user != null){
              return new WishList({user}).save()
          }else if(event != null){
            return new WishList({event}).save()
    
          }
      },
      /**
       * Obtiene una lista relacionada con el usuario
       * @param user `_id` User
       */
      getListByUser(user){
          return WishList.findOne({user})
      },
      /**
       * Obtiene una lista relacionada a un evento
       * @param event `_id` Event
       */
      getListByEvent(event){
          return WishList.findOne({event})
      }
    }
);

/**
 * Exporta el modelo
 */
export default WishList;
