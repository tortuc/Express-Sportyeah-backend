import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de StructureDivision
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
  structure: Type.objectId({ required: true, ref: "Structure" }),
  name: Type.string({ required: true }),
  image: Type.string({ required: true }),
  description: Type.string(),
  date: Type.date({ default: Date.now }),
  deleted: Type.boolean({ default: false }),
});

const StructureDivision = typedModel(
  "StructureDivision",
  schema,
  undefined,
  undefined,
  {
    /**
     * Crea una division en la structura del club
     * @param {StructureDivision} division
     * @returns
     */
    createOne(division) {
      return new StructureDivision(division).save();
    },
    /**
     * Retorna todas las divisiones en una estructura de club
     * @param structure _id Structure
     * @returns
     */
    getAllByStructure(structure) {
      return StructureDivision.find({ deleted: false, structure });
    },
    /**
     * Obtiene la informacion de una division
     * @param structure
     * @returns
     */
    getOne(structure) {
      return StructureDivision.findOne({
        _id: structure,
        deleted: false,
      }).populate("structure");
    },
    /**
     * Modifica una division
     * @param id _id de la division
     * @param newData nueva data
     * @returns
     */
    updateDivision(id, newData) {
      return StructureDivision.findByIdAndUpdate(id, newData, { new: true });
    },
    /**
     * Eliminar una division
     * @param id
     * @returns
     */
    deleteDivision(id) {
      return StructureDivision.findByIdAndUpdate(
        id,
        { deleted: true },
        { new: true }
      );
    },

    async createDefaultDivisions(structure) {
      let one = new StructureDivision({
        name: "División masculina",
        description: "División masculina",
        structure,
        image: "assets/structure/mens.jpg",
      });
      let two = new StructureDivision({
        name: "División femenina",
        description: "División  femenina",
        structure,
        image: "assets/structure/womans.jpg",
      });
      let three = new StructureDivision({
        name: "División Mixta",
        description: "División Mixta",
        structure,
        image: "assets/structure/mixta.jpg",
      });
      await one.save();
      await two.save();
      await three.save();
    },
  }
);

/**
 * Exporta el modelo
 */
export default StructureDivision;
