import { createSchema, Type, typedModel } from "ts-mongoose";
import StructureTeam from "./structureTeam";

/**
 * Modelo de StructureCategory
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
  division: Type.objectId({ required: true, ref: "StructureDivision" }),
  name: Type.string({ required: true }),
  image: Type.string({ required: true }),
  description: Type.string(),
  date: Type.date({ default: Date.now }),
  deleted: Type.boolean({ default: false }),
});

const StructureCategory = typedModel(
  "StructureCategory",
  schema,
  undefined,
  undefined,
  {
    /**
     * Crea una categoria para una division en la structura del club
     * @param {StructureCategory} category
     * @returns
     */
    createOne(category) {
      return new StructureCategory(category).save();
    },
    /**
     * Retorna todas las Categorias en una division
     * @param division _id division
     * @returns
     */
    getAllByDivision(division) {
      return StructureCategory.find({ deleted: false, division });
    },
    /**
     * Obtiene la informacion de una categoria
     * @param category
     * @returns
     */
    getOne(category) {
      return StructureCategory.findOne({
        _id: category,
        deleted: false,
      })
        .populate("division")
        .populate({ path: "division", populate: { path: "structure" } });
    },
    /**
     * Modifica una categoria
     * @param id _id de la categoria
     * @param newData nueva data
     * @returns
     */
    updateCategory(id, newData) {
      return StructureCategory.findByIdAndUpdate(id, newData, { new: true });
    },
    /**
     * Eliminar una categoria
     * @param id
     * @returns
     */
    deleteCategory(id) {
      return StructureCategory.findByIdAndUpdate(
        id,
        { deleted: true },
        { new: true }
      );
    },

    async createDefaultCategorys(division) {
      let one = new StructureCategory({
        name: "Categoria infantil",
        description: "Equipos de la categoria infantil",
        division,
        image: "assets/structure/categorychild.jpg",
      });
      let two = new StructureCategory({
        name: "Categoria juvenil",
        description: "Equipos de la categoria juvenil",
        division,
        image: "assets/structure/young.jpg",
      });

      await one.save();
      StructureTeam.createDefaultTeams(one._id);
      await two.save();
      StructureTeam.createDefaultTeams(two._id);
    },
  }
);

/**
 * Exporta el modelo
 */
export default StructureCategory;
