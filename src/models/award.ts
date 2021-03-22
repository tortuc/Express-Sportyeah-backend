import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de Awards
 *
 * @author David Valor  <davidvalorwork@gmail.com>
 * @copyright Sapviremoto
 *
 * @link https://www.npmjs.com/package/ts-mongoose
 */

export interface IAwards {
  _id: string;
  userId: string;
  position: string;
  federationTeam: string;
  place: string;
  eventDate: Date;
  title: string;
  description: string;
  multimediaContent: string[];
  date: Date;
  deleted: boolean;
}


/**
 * Define el esquema del modelo
 */
const schema = createSchema({
  userId: Type.objectId({required: true,ref:'User'}),
  position: Type.string({ required: true}),
  federationTeam: Type.string({ required: true }),
  place: Type.string({ required: true }),
  eventDate: Type.date({ required: true }),
  title: Type.string({ required: true }),
  description: Type.string({ required: true }),
  multimediaContent: [Type.string()],
  date: Type.date({ default: Date.now }),
  deleted: Type.boolean({ default: false }),
});

const Awards = typedModel("award", schema, undefined, undefined, {
  /**
   * Devuelva la informacion de un Experiencia
   * @param id `_id` del Awards
   */
  getAwardsByUser(userId:string) {
    return Awards.find({userId,deleted:false}).sort({finishDate:-1});
  },

  /**
   * Crea una experiencia
   * @param Awards
   */
  newAwards(award) {
    return new Awards(award).save();
  },
  /**
   * Borrar una Experiencia
   * @param id  id del Experiencia
   */
  deleteAwards(id) {
    return Awards.findByIdAndUpdate(id, { deleted: true });
  },
  /**
   * Editar una Experiencia
   * @param id id del Experiencia
   * @param Awards Experiencia con los nuevos datos
   */
  updateAwards(id, award) {
    return Awards.findOneAndUpdate({_id:id},award);
  },
  /**
   * Devuelva la informacion de un Experiencia
   * @param id `_id` del Awards
   */
  getOneAwards(id) {
    return Awards.findById(id).populate("user post");
  },
});

/**
 * Exporta el modelo
 */
export default Awards;
