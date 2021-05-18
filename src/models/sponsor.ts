import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de Sponsor
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
  /**
   * Usuario que ha creado el patrocinador
   */
  user: Type.objectId({ required: true, ref: "User" }),
  /**
   * Id del usuario patrocinador en sportyeah
   */
  idSponsor: Type.objectId({ required: true, ref: "User" }),
  /**
   * Url del patrocinador, si no tiene cuenta en sportyeah
   */
  url: Type.string({ required: false, default: "" }),
  /**
   * Nombre del patrocinador
   */
  name: Type.string({ required: false, default: "" }),
  /**
   * Imagen del patrocinador, si no tiene cuenta en sportyeah
   */
  image: Type.string({ required: false, default: "" }),
  /**
   * Indica si este patrocinador ha sido borrado
   */
  deleted: Type.boolean({ default: false }),
});

const Sponsor = typedModel("Sponsor", schema, undefined, undefined, {
  /**
   * Crea un patrocinador
   * @param {Sponsor} sponsor cuerpo del sponsor
   */
  createOne(sponsor) {
    return new Sponsor(sponsor).save();
  },
  /**
   * Retorna todos los patrocinadores creados por un usuario
   * @param user _id del usuario
   */
  getSponsorsByUser(user) {
    return Sponsor.find({ deleted: false, user }).populate("idSponsor");
  },
  /**
   * Editar o modificar un patrocinador
   * @param id _id del patrocinador
   * @param sponsor Nueva data del patrocinador
   */
  updateSponsor(id, sponsor) {
    return Sponsor.findByIdAndUpdate(id, sponsor, { new: true }).populate(
      "idSponsor"
    );
  },
  /**
   * Editar o modificar un patrocinador
   * @param id _id del patrocinador
   * @param sponsor Nueva data del patrocinador
   */
  deleteSponsor(id) {
    return Sponsor.findByIdAndUpdate(id, { deleted: true }, { new: true });
  },
});

/**
 * Exporta el modelo
 */
export default Sponsor;
