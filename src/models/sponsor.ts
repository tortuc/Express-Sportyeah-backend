import { create } from 'domain';
import { createSchema, Type, typedModel } from 'ts-mongoose';


/**
 * Define el esquema del modelo
 */

const schema = createSchema({
    user        : Type.objectId({ required:true, ref: "User" }),
    visitor     : Type.objectId({required:true, ref:"User"}),
    date        : Type.date({ default: Date.now }),
    from        : Type.string({required:true,enum:['post', 'chat','search','profile','reaction','comment','ranking','news']}),
    link        : Type.string({}),
    nameSponsor : Type.string({})
  });


  const ViewsSponsor = typedModel("ViewsSponsor",schema,undefined,undefined,{
        /**
   * Crea una vista
   * @param view
   */
  createSponsorView(view) {
    return new ViewsSponsor(view).save();
  },

/**
   * Obtiene una vista por el id del usuario
   * @param id 
   */
  getSponsorView(id) {
    return ViewsSponsor.find({user:id})
    .populate("user")
    // .populate({path:'visits',populate:'user'})

  },

  

  /**
   * Busca a las vistas por fecha
   * 
   */
   getPostViewsByDay(id,start,end) {

    let startTime = new Date(start)
    let endTime = new Date(end);
    

  return  ViewsSponsor.find(
    { user:id,date: { $gte: startTime, $lt: endTime } }
    )
  },
  /**
   * Busca a las vistas por fecha
   * 
   */
  getPostViewsByTime(id,start, end) {
    let startTime = new Date(start);
    let endTime = new Date(end);
    
  return  ViewsSponsor.find(
    { user:id,date: { $gte: startTime, $lte: endTime } }
    )
  },




  /**
   * Busca a las vistas  por busqueda  usuario
   * 
   */
   getViewsSponsorAllSearchTime() {
    return ViewsSponsor.aggregate([
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
    getViewsSponsorSearchByTime(start, end) {
      let startTime = new Date(start);
      let endTime = new Date(end);

      return ViewsSponsor.aggregate([
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
 getViewsSponsorReboundAllTime() {
  return ViewsSponsor.aggregate([
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
  getViewsSponsorReboundByTime(start, end) {
    let startTime = new Date(start);
    let endTime = new Date(end);

    return ViewsSponsor.aggregate([
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
     * Retorna un conteo de las visitas que han hecho al sponsor, por dia indicado
     * @param user _id del perfil
     * @param date fecha de inicio de la busqueda, se agregara un dia mas para completar el rango de 24 horas
     * @returns 
     */
  async getVisitsByDate(user,date,from){
    // dia donde empieza la busqueda
    let day = new Date(date)
    // dia final
    let dayAfter = new Date(day)
    // se agrega un dia para completar el rango de 24 horas
    dayAfter.setDate(day.getDate() + 1)
    
    return ViewsSponsor.countDocuments({user,from,date:{$gte:day,$lte:dayAfter}})
  },

  
 /**
     * Retorna un conteo de las visitas que han hecho al sponsor, por dia indicado
     * @param user _id del perfil
     * @param date fecha de inicio de la busqueda, se agregara un dia mas para completar el rango de 24 horas
     * @returns 
     */
  async getVisitsByMonth(user,date,from){
    // dia donde empieza la busqueda
    let month = new Date(date)
    
    // dia final
    let monthAfter = new Date(month)
    // se agrega un dia para completar el rango de 24 horas
    monthAfter.setMonth(month.getMonth() + 1)

    return ViewsSponsor.countDocuments({user,from,date:{$gte:month,$lte:monthAfter}})
  },

   /**
     * Retorna un conteo de las visitas que han hecho al sponsor, En un dia indicado
     * @param user _id del perfil
     * @param date fecha de inicio de la busqueda, se agregara un dia mas para completar el rango de 24 horas
     * @returns 
     */
  async getVisitsByHour(user,date,from){
    // dia donde empieza la busqueda
    let hour = new Date(date)
    

    // dia final
    let hoursAfter = new Date(hour)
    // se agrega un dia para completar el rango de 24 horas
    hoursAfter.setHours(hour.getHours() + 1)
    return ViewsSponsor.countDocuments({user,from,date:{$gte:hour,$lte:hoursAfter}})
  },

   /**
     * Retorna un conteo de las visitas que han hecho al sponsor, por dia indicado
     * @param user _id del perfil
     * @param date fecha de inicio de la busqueda
     * @returns 
     */
    async getVisitsByYear(user,date,from,nameSponsor){
      // dia donde empieza la busqueda
      let startDay = new Date(date)
      
      // dia final
      let endDate = new Date(startDay)
      // se agrega un dia para completar el rango de 24 horas
      endDate.setMonth(startDay.getMonth() + 1)
  
      return ViewsSponsor.countDocuments({user,nameSponsor,from,date:{$gte:startDay,$lte:endDate}})
    },
  })

  /**
 * Exporta el modelo
 */
export default ViewsSponsor;