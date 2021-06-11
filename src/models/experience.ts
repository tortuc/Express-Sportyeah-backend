import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de Experiences
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
  position: Type.string({ required: true }),
  federationTeam: Type.string({ required: true }),
  nowIn: Type.boolean({ required: true }),
  place: Type.string({ required: true }),
  initDate: Type.date({ required: true }),
  finishDate: Type.date({ default: null }),
  title: Type.string({ required: true }),
  description: Type.string({ required: true }),
  /**
   * Archivos multimedia de la experiencia
   */
  files: Type.array({ default: [] }).of({
    format: Type.string({ required: true }),
    url: Type.string({ required: true }),
  }),
  date: Type.date({ default: Date.now }),
  deleted: Type.boolean({ default: false }),
});

const Experience = typedModel("Experience", schema, undefined, undefined, {
  /**
   * Devuelva la informacion de un Experiencia
   * @param id `_id` del Experience
   */
  getExperienceByUser(userId: string) {
    return Experience.find({ userId, deleted: false }).sort({ initDate: -1 });
  },

  /**
   * Crea una experiencia
   * @param Experience
   */
  newExperience(experience) {
    return new Experience(experience).save();
  },
  /**
   * Borrar una Experiencia
   * @param id  id del Experiencia
   */
  deleteExperience(id) {
    return Experience.findByIdAndUpdate(id, { deleted: true });
  },
  /**
   * Editar una Experiencia
   * @param id id del Experiencia
   * @param Experience Experiencia con los nuevos datos
   */
  updateExperience(id, experience) {
    return Experience.findOneAndUpdate({ _id: id }, experience,{new:true});
  },
  /**
   * Devuelva la informacion de un Experiencia
   * @param id `_id` del Experience
   */
  getOneExperience(id) {
    return Experience.findById(id).populate("user post");
  },
});

/**
 * Exporta el modelo
 */
export default Experience;
