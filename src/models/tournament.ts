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
  logo: Type.string(),
  group: Type.number({ default: 0 }),
  team_group: Type.number({ default: 0 }),
  description: Type.string({ required: true }),
  start_date: Type.date({ default: Date.now }),
  end_date: Type.date({ default: Date.now }),
  participation_date: Type.date({ default: Date.now }),    
  deleted : Type.boolean({default:false}),
  status: Type.number({ default: 0 }),
  tournamentScore    : Type.objectId({ref: 'TournamentScore',required:true}),
});

const Tournament = typedModel("Tournament", schema, undefined, undefined, {
  /**
   * Obtiene el Tournament por su id
   *
   * @param {string} id   El id del torneo
   */
  async findByUserId(id: string) {
    return await Tournament.findById(id).populate('tournamentScore');
  },

  /**
   * Crea un torneo o liga
   * @param {Tournament} tournamentData
   */
  async create(tournamentData) {
    return await new Tournament(tournamentData).save();
  },

  /**
   * Update un torneo o liga
   * @param {Tournament} tournamentData
   * * @param {string} id
   */
  async updateTournament(id, tournamentData) {
    return await Tournament.findByIdAndUpdate(id, tournamentData);
  },

  /**
   * Todos los torneo o liga
   * @param {Tournament} tournamentData
   * * @param {string} id
   */
   async getAll() {
    return await Tournament.find({deleted:false}).populate('tournamentScore');
  },

});

export default Tournament;