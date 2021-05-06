import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de Wish
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
    user        : Type.objectId({required:true,ref:'User'}),
    list        : Type.string({required: true,ref:'WishList'}),
    date        : Type.date({default: Date.now}),
    type        : Type.string({enum:['article','activity'],required:true,default:'article'}),
    privacity   : Type.string({required:true,enum:['public','private'],default:'private'}),
    title       : Type.string({required:true}),
    description : Type.string({required:true}),
    price       : Type.number({default:0}),
    endDate     : Type.date({required:true}),
    location    : Type.string({default:null}),
    files       : Type.array({default:[]}).of({
        url     : Type.string({required:true}),
        name    : Type.string({default:null}),
        type    : Type.string({required:true,enum:['image','video','document','youtube'],default:'image'})
    }),
    done        : Type.boolean({default:false}),
    deleted     : Type.boolean({default:false})

});

const Wish = typedModel('Wish', schema, undefined, undefined, 
    {
        /**
         * Crea un deseo 
         * @param wish 
         */
      createWish(wish){
          return new Wish(wish).save()
      },
      /**
       * Obtiene todos los deseos de una lista
       * @param list 
       */
      getWishByList(list){
          return Wish.find({list,deleted:false}).populate('user').sort({date:-1})

      },
      /**
       * Cambiar la privacidad de el deseo
       * @param id `_id` del deseo `Wish`
       * @param option `string` puede ser `public | private`
       */
      changePrivacity(id,option){
        return Wish.findByIdAndUpdate(id,{privacity:option})
      },
      /**
       * Obtiene un deseo por su id
       * @param id 
       */
      getById(id){
          return Wish.findById(id)
      },
      /**
       * Marca un deseo como eliminado
       * @param id `_id` del deseo
       */
      deleteById(id){
          return Wish.findByIdAndUpdate(id,{deleted:true})
      },
      /**
       * Cambia le estado del campo `done`
       * @param id  `_id` Del wish
       * @param bool `true` o `false`
       */
      doneUndone(id,bool:boolean){
          return Wish.findByIdAndUpdate(id,{done:bool})
      },
      /**
       * Edita un Deseo
       * @param id `_id` del wish
       * @param wish Campo con los datos a editar
       */
      editOne(id,wish){
          return Wish.findByIdAndUpdate(id,wish,{ new : true })
      }

    }
);

/**
 * Exporta el modelo
 */
export default Wish;
