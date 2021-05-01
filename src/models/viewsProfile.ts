import { create } from 'domain';
import { createSchema, Type, typedModel } from 'ts-mongoose';


/**
 * Define el esquema del modelo
 */

const schema = createSchema({
    user     : Type.objectId({ required:true, ref: "User" }),
    visitor  : Type.objectId({required:true, ref:"User"}),
    date     : Type.date({ default: Date.now }),
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
    return ViewsProfile.find({user:id})
    .populate("user")
    // .populate({path:'visits',populate:'user'})

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
        { $match: { from:"search" } },
        {
          $group: {
            _id:{user:"$user"},
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
          { $match: { from:"search", date: { $gte: startTime, $lte: endTime }}  },
          {
            $group: {
              _id:{user:"$user"},
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]);
    },


    /**
   * Busca a las vistas  por rebote  usuario
   * 
   */
 getViewsProfileReboundAllTime() {
  return ViewsProfile.aggregate([
      { $match: { from:{$ne:"search"} } },
      {
        $group: {
          _id:{user:"$user"},
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
},
 /**
 * Busca a las vistas por rebote de fecha useario 
 * 
 */
  getViewsProfileReboundByTime(start, end) {
    let startTime = new Date(start);
    let endTime = new Date(end);

    return ViewsProfile.aggregate([
        { $match: {from:{$ne:"search"} , date: { $gte: startTime, $lte: endTime }}  },
        {
          $group: {
            _id:{user:"$user"},
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);
  },

  /**
     * Retorna un conteo de las visitas que han hecho a un usuario, por dia indicado
     * @param user _id del perfil
     * @param date fecha de inicio de la busqueda, se agregara un dia mas para completar el rango de 24 horas
     * @returns 
     */
   async getVisitsByDate(user,date,from){
    // dia donde empieza la busqueda
    let day = new Date(date)
    // dia final
    let dayAfter = new Date(date)
    // se agrega un dia para completar el rango de 24 horas
    dayAfter.setDate(day.getDate() + 1)
    
    return ViewsProfile.countDocuments({user,from,date:{$gte:day,$lte:dayAfter}})
  },
  })

  



  /**
 * Exporta el modelo
 */
export default ViewsProfile;