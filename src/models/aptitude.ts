import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de aptitudes
 *
 * @author David Valor  <davidvalorwork@gmail.com>
 * @copyright Retail Servicios Externos SL
 *
 * @link https://www.npmjs.com/package/ts-mongoose
 */

/**
 * Define el esquema del modelo
 */
const schema = createSchema({
  userId: Type.objectId({ required: true, ref: "User" }),
  title: Type.string({ required: true }),
  score: Type.string({ required: true }),
  date: Type.date({ default: Date.now }),
  deleted: Type.boolean({ default: false }),
});

const Aptitudes = typedModel("aptitude", schema, undefined, undefined, {
  /**
   * Devuelva la informacion de un Experiencia
   * @param id `_id` del aptitudes
   */
  getAptitudesByUser(userId: string) {
    return Aptitudes.find({ userId });
  },

  /**
   * Crea una experiencia
   * @param aptitudes
   */
  newAptitudes(aptitude) {
    return new Aptitudes(aptitude).save();
  },
  /**
   * Borrar una Experiencia
   * @param id  id del Experiencia
   */
  deleteAptitudes(id) {
    return Aptitudes.findByIdAndUpdate(id, { deleted: true });
  },
  /**
   * Editar una Experiencia
   * @param id id del Experiencia
   * @param aptitudes Experiencia con los nuevos datos
   */
  updateAptitudes(id, aptitude) {
    return Aptitudes.findOneAndUpdate({ _id: id }, aptitude, { new: true });
  },
  /**
   * Devuelva la informacion de un Experiencia
   * @param id `_id` del aptitudes
   */
  getOneAptitudes(id) {
    return Aptitudes.findById(id).populate("user post");
  },
});

/**
 * Exporta el modelo
 */
export default Aptitudes;
