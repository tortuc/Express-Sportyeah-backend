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
  group_name: Type.string({ required: true }),
  user   : Type.objectId({ref: 'User',required:true}),
  billy_category_id: Type.objectId({ref: 'Categorytournament',required:true}),
  amount:Type.decimal128({ required: true }),
  group_image_url: Type.string({ required: true }),
  billy_type: Type.number({ default: 0 }),
  deleted : Type.boolean({default:false}),
  status: Type.number({ default: 1 })
});

const Porratournament = typedModel("Porratournament", schema, undefined, undefined, {
  /**
   * Obtiene el categoria del torneos por su id
   *
   * @param {string} id   El id del torneo
   */
  async findById(id: string) {
    return await Porratournament.findById(id).populate("Categorytournament");
  },

  /**
   * Crea un torneo o liga
   * @param {Porratournament} PorratournamentData
   */
  async create(porratournamentData) {
    return await new Porratournament(porratournamentData).save();
  },

  /**
   * Update un torneo o liga
   * @param {Porratournament} PorratournamentData
   * * @param {string} id
   */
  async update(id, PorratournamentData) {
    return await Porratournament.findByIdAndUpdate(id, PorratournamentData);
  },

  /**
   * Todos los torneo o liga
   * @param {Porratournament} PorratournamentData
   * * @param {string} id
   */
   async getAll(user) {
    return await Porratournament.find({user,deleted:false}).populate("Categorytournament");
  },

  
  async delete(id) {
    return Porratournament.findByIdAndUpdate(id, { deleted: true });
  },

});

export default Porratournament;