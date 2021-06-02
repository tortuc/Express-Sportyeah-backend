import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de StructureTeam
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
  category: Type.objectId({ required: true, ref: "StructureCategory" }),
  name: Type.string({ required: true }),
  image: Type.string({ required: true }),
  description: Type.string(),
  date: Type.date({ default: Date.now }),
  deleted: Type.boolean({ default: false }),
});

const StructureTeam = typedModel(
  "StructureTeam",
  schema,
  undefined,
  undefined,
  {
    /**
     * Crea un equipo  para una categoria
     * @param {StructureTeam} team
     * @returns
     */
    createOne(team) {
      return new StructureTeam(team).save();
    },
    /**
     * Retorna todas los equipos de una categoria
     * @param category _id category
     * @returns
     */
    getAllByCategory(category) {
      return StructureTeam.find({ deleted: false, category });
    },
    /**
     * Obtiene la informacion de un equipo
     * @param team
     * @returns
     */
    getOne(team) {
      return StructureTeam.findOne({
        _id: team,
        deleted: false,
      })
        .populate("category")
        .populate({ path: "category", populate: { path: "division" , populate:{path:"structure"}} });
    },
    /**
     * Modifica un equipo
     * @param id _id del equipo
     * @param newData nueva data
     * @returns
     */
    updateTeam(id, newData) {
      return StructureTeam.findByIdAndUpdate(id, newData, { new: true });
    },
    /**
     * Eliminar un equipo
     * @param id
     * @returns
     */
    deleteTeam(id) {
      return StructureTeam.findByIdAndUpdate(
        id,
        { deleted: true },
        { new: true }
      );
    },

    async createDefaultTeams(category) {
      let one = new StructureTeam({
        name: "Equipo A",
        description: "Equipo de muestra",
        category,
        image: "assets/structure/team1.jpg",
      });
      let two = new StructureTeam({
        name: "Equipo B",
        description: "Equipo de muestra",
        category,
        image: "assets/structure/team2.jpg",
      });

      await one.save();
      await two.save();
    },
  }
);

/**
 * Exporta el modelo
 */
export default StructureTeam;
