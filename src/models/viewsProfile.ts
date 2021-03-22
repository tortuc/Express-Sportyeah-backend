import { create } from 'domain';
import { createSchema, Type, typedModel } from 'ts-mongoose';


/**
 * Define el esquema del modelo
 */

const schema = createSchema({
    user: Type.objectId({ required:true, ref: "User" }),
    visits: Type.array({default:[]}).of({ 
        user     : Type.objectId({required:true, ref:"User"}),
        Date     : Type.date({ default: Date.now }),
        from     : Type.string({required:true,enum:['post', 'chat','search','profile','reaction','comment','ranking']}),
        link     : Type.string({})
    }),
    
  });


  const ViewsProfile = typedModel("ViewsProfile",schema,undefined,undefined,{
        /**
   * Crea una vista
   * @param view
   */
  createProfileView(view) {
    return new ViewsProfile(view).save();
  },

/**
   * Obtiene una vista por el id del usuario
   * @param id 
   */
  getProfileView(id) {
    return ViewsProfile.findOne({user:id})
    .populate("user")
    .populate({path:'visits',populate:'user'})

  },

   updateProfileView(id,user,from,link){

    return ViewsProfile.findByIdAndUpdate(id,{$push:{visits:{user,from,link}}})
  }

  })

  
  /**
 * Exporta el modelo
 */
export default ViewsProfile;