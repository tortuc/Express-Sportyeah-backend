import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de Experiences
 *
 * @author Duglas Moreno <duglasoswaldomoreno@gmail.com>
 * @copyright dmoreno.com
 *
 * @link https://www.npmjs.com/package/ts-mongoose
 */

/**
 * Schema de Torneo
 *
 */

const schema = createSchema({
  name: Type.string({ required: true }),
  deleted : Type.boolean({default:false}),
  status: Type.number({ default: 0 })
});

const Categorytournament = typedModel("Categorytournament", schema, undefined, undefined, {
  /**
   * Obtiene el categoria del torneos por su id
   *
   * @param {string} id   El id del torneo
   */
  async findByCategoryId(id: string) {
    return await Categorytournament.findById(id);
  },

  /**
   * Crea un torneo o liga
   * @param {Categorytournament} categorytournamentData
   */
  async create(categorytournamentData) {
    return await new Categorytournament(categorytournamentData).save();
  },

  /**
   * Update un torneo o liga
   * @param {Categorytournament} categorytournamentData
   * * @param {string} id
   */
  async updateCategorytournament(id, categorytournamentData) {
    return await Categorytournament.findByIdAndUpdate(id, categorytournamentData);
  },

  /**
   * Todos los torneo o liga
   * @param {Tournament} tournamentData
   * * @param {string} id
   */
   async getAll() {
    return await Categorytournament.find({deleted:false});
  },

  
  async deleteCategory(id) {
    return Categorytournament.findByIdAndUpdate(id, { deleted: true });
  },

});

export default Categorytournament;