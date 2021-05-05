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
 * Schema Score de Torneo
 *
 */

 const schema = createSchema({
    tournament: Type.objectId({required: true,ref:"Tournament"}),
    resultGame: Type.number({ default: 0 }),   
    bestPlayer: Type.number({ default: 0 }), 
    hitPostion: Type.number({ default: 0 }), 
    matchCrosses: Type.number({ default: 0 }), 
    resultMatchCrosses: Type.number({ default: 0 }),  
    bestPlayerCrosses: Type.number({ default: 0 }),
    firstTeam: Type.number({ default: 0 }), 
    secondTeam: Type.number({ default: 0 }),
    thirdTeam: Type.number({ default: 0 }), 
    bestPlayerTournament: Type.number({ default: 0 }), 
    goalkeeperGoals: Type.number({ default: 0 }),  
  });

  const TournamentScore = typedModel("TournamentScore", schema, undefined, undefined, {
    /**
     * Obtiene el TournamentScore por su id
     *
     * @param {string} id   El id del torneo
     */
    async findByUserId(id: string) {
      return await TournamentScore.findById(id);
    },
  
    /**
     * Crea el score del torneo
     * @param {TournamentScore} TournamentScoreData
     */
    async create(TournamentScoreData) {
      return await new TournamentScore(TournamentScoreData).save();
    },
  
    /**
     * Update un store del torneo o liga
     * @param {TournamentScore} TournamentScoreData
     * * @param {string} id
     */
    async updateScore(id, TournamentScoreData) {
      return await TournamentScore.findByIdAndUpdate(id, TournamentScoreData);
    },
  
  
  
  });

  export default TournamentScore;