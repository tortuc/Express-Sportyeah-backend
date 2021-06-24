import { createSchema, Type, typedModel } from "ts-mongoose";
import OrganizationProfile from "./organizationProfile";
import StructureDivision from "./structureDivision";
import User from "./user";

/**
 * Modelo de Strucure
 *
 * Este modelo es para las estructuras de los clubes
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
   * Usuario a cual pertenece esta estructura
   */
  user: Type.objectId({ required: true, ref: "User" }),

  /**
   * Nombre de el club o de su estructura
   */

  name: Type.string({ required: true }),
  /**
   * Logo del club
   */

  logo: Type.string({ required: true, default: "assets/logos/logo.png" }),

  /**
   * Descripcion de la estructura o club
   */
  description: Type.string({}),
  /**
   * Redes sociales de este club o estructura
   */
  socialNetworks: Type.object().of({
    tiktok: Type.string({ default: null }),
    facebook: Type.string({ default: null }),
    linkedin: Type.string({ default: null }),
    instagram: Type.string({ default: null }),
    twitter: Type.string({ default: null }),
  }),
  /**
   * Fecha en que se creo
   */
  date: Type.date({ default: Date.now }),
});

const Structure = typedModel("Structure", schema, undefined, undefined, {
  /**
   * Busca la estructura de un usuario, si no existe la crea
   * @param user
   * @returns
   */
  async findByUSer(user) {
    let structure = await Structure.findOne({ user });

    if (structure) {
      return structure;
    } else {
      let userData = await User.findById(user);
      let newStructure = {
        socialNetworks: {
          tiktok: "",
          facebook: "",
          linkedin: "",
          instagram: "",
          twitter: "",
        },
        name: `${userData.name} ${userData.last_name}`,
        description: `${userData.name} ${userData.last_name} en sportyeah`,
        user: userData._id,
      };
      let structureCreated = await new Structure(newStructure).save();
      OrganizationProfile.createDefaultProfiles(structureCreated._id);
      StructureDivision.createDefaultDivisions(structureCreated._id);
      return structureCreated;
    }
  },
  /**
   * Editar la inforamcion de una estructura
   * @param id _id de la estructura
   * @param newData nueva informacion
   * @returns
   */
  updateStructure(id, newData) {
    return Structure.findByIdAndUpdate(id, newData, { new: true });
  },
});

/**
 * Exporta el modelo
 */
export default Structure;
