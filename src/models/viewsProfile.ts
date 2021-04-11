import { create } from 'domain';
import { createSchema, Type, typedModel } from 'ts-mongoose';


/**
 * Define el esquema del modelo
 */

const schema = createSchema({
    user     : Type.objectId({ required:true, ref: "User" }),
    visitor  : Type.objectId({required:true, ref:"User"}),
    Date     : Type.date({ default: Date.now }),
    from     : Type.string({required:true,enum:['post', 'chat','search','profile','reaction','comment','ranking']}),
    link     : Type.string({})
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
  },


  /**
   * Busca a las vistas  por busqueda  usuario
   * 
   */
   getViewsProfileAllSearchTime() {
    return ViewsProfile.aggregate([
        { $match: { visits:{$elemMatch:{from:"search"}} } },
        {
          $group: {
            _id:{user:"$user",visits:"$visits"},
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);
  },
   /**
   * Busca a las vistas por busqueda de fecha useario 
   * 
   */
    getViewsProfileSearchByTime(start, end) {
      let startTime = new Date(start);
      let endTime = new Date(end);
      return ViewsProfile.aggregate([
          { $match: { visits:{$elemMatch:{from:"search",date: { $gte: startTime, $lte: endTime }}} } },
          {
            $group: {
              _id:{user:"$user",visits:"$visits"},
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]);
    },

  })

  
  /**
 * Exporta el modelo
 */
export default ViewsProfile;