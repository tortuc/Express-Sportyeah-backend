import { profile } from "console";
import { ObjectId } from "mongoose";
import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de OrganizationProfiles
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
   * Referencia a la estructura que pertenece
   */
  structure: Type.objectId({ required: true, ref: "Structure" }),
  /**
   * Referencia al usuario de sportyeah, si tiene
   */
  user: Type.objectId({ default: null, ref: "User" }),
  /**
   * Nombre del perfil
   */
  photo: Type.string({ required: true }),
  /**
   * Nombre del perfil
   */
  name: Type.string({ required: true }),
  /**
   * Historia del perfil o persona
   */
  history: Type.string({}),
  /**
   * Nombre del Cargo que ostenta
   */
  position: Type.string({ required: true }),
  /**
   * Descripcion del cargo
   */
  description: Type.string({}),
  /**
   * Fecha desde que ocupa el cargo
   */
  date: Type.date({ default: Date.now }),
  deleted: Type.boolean({ default: false }),
});

const OrganizationProfile = typedModel(
  "OrganizationProfile",
  schema,
  undefined,
  undefined,
  {
    /**
     * Crea un registro de organigrama
     * @param profile
     * @returns
     */
    createOne(profile) {
      return new OrganizationProfile(profile).save();
    },
    /**
     * Crea tres perfiles por defecto, para que haya informacion en la estructura
     * @param structure _id de la structura
     * @returns
     */
    async createDefaultProfiles(structure: ObjectId | string): Promise<void> {
      let pepe = new OrganizationProfile({
        structure,
        name: "Pepe escamilla",
        position: "Presidente",
        description: "Presidente del club",
        history: "Usuario de demostracion para el organigrama del club",
        photo: "assets/structure/president.jpg",
      });
      let maria = new OrganizationProfile({
        structure,
        name: "Maria infante",
        position: "Vicepresidenta",
        description: "Vicepresidenta del club",
        history: "Usuario de demostracion para el organigrama del club",
        photo: "assets/structure/vicepresident.jpg",
      });
      let pablo = new OrganizationProfile({
        structure,
        name: "Pablo Valderrama",
        position: "Director de area",
        description: "Director de area del club",
        history: "Usuario de demostracion para el organigrama del club",
        photo: "assets/structure/vicepresident.jpg",
      });

      await pepe.save();
      await maria.save();
      await pablo.save();
    },
    /**
     * Obtiene todos los perfiles de un organigrama, perteneciente a una estructura
     * @param structure
     * @returns
     */
    getAllByStructure(structure) {
      return OrganizationProfile.find({ deleted: false, structure }).populate(
        "user"
      );
    },
    /**
     * Retorna la informacion de un perfil, por su id
     * @param id
     * @returns
     */
    getInfoByID(id) {
      return OrganizationProfile.findOne({ _id: id, deleted: false }).populate(
        "user structure"
      );
    },
    /**
     * Modifica la informacion de un perfil
     * @param {ObjectId} id
     * @param {OrganizationProfile} newData nueva informacion
     */
    updateProfileById(id, newData) {
      return OrganizationProfile.findByIdAndUpdate(id, newData, {
        new: true,
      }).populate("user structure");
    },
    /**
     * Elimina un perfil
     * @param id
     * @returns
     */
    deleteOneById(id) {
      return OrganizationProfile.findByIdAndUpdate(
        id,
        { deleted: true },
        { new: true }
      );
    },
  }
);

/**
 * Exporta el modelo
 */
export default OrganizationProfile;
