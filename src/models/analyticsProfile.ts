import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Define el esquema del modelo para las analiticas del perfil 
 * ultimas visitas, perfil visitado fecha
 */
const schema = createSchema({
  /**
   * _id del usuario que visita
   */
  visitor: Type.objectId({ref:'User',required:true}),
  /**
   * _id del usuario a quien visitan
   */
  profile: Type.objectId({ref:'User',required:true}),
  /**
   * fecha en que visitaron
   */
  date: Type.date({ default: Date.now }),
});

const AnalyticProfile = typedModel(
  "AnalyticProfile",
  schema,
  undefined,
  undefined,
  {
    /**
     * Retorna las ultimas 5 visitas al perfil
     * @param profile _id del perfil
     * @returns 
     */
    getVisits(profile) {
      return AnalyticProfile.find({profile}).populate("visitor").sort({date:-1}).limit(5)
    },
    /**
     * Agrega una visita a un perfil
     * @param profile _id del perfil que visitan
     * @param visitor _id del usuario que visita
     * @returns 
     */
    async addVisit(profile,visitor) {
      return new AnalyticProfile({profile,visitor}).save()
    },
    /**
     * Retorna un conteo de todas las veces que han visitado el perfil
     * @param profile _id del perfil
     * @returns 
     */
    getCountOfVisits(profile){      
      return AnalyticProfile.countDocuments({profile})
    },
    /**
     * Retorna un conteo de las visitas que han hecho al perfil, por dia indicado
     * @param profile _id del perfil
     * @param date fecha de inicio de la busqueda, se agregara un dia mas para completar el rango de 24 horas
     * @returns 
     */
    getVisitsByDate(profile,date){
      // dia donde empieza la busqueda
      let day = new Date(date)
      // dia final
      let dayAfter = new Date(day)
      // se agrega un dia para completar el rango de 24 horas
      dayAfter.setDate(day.getDate() + 1)
      
      return AnalyticProfile.countDocuments({profile,date:{$gte:day,$lte:dayAfter}})
    },
  }
);

/**
 * Exporta el modelo
 */
export default AnalyticProfile;
