import moment = require("moment");
import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de StructurePlayer
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
  team: Type.objectId({ required: true, ref: "StructureTeam" }),
  user: Type.objectId({ default: null, ref: "User" }),

  name: Type.string({ required: true }),
  height: Type.string({ required: true }),
  role: Type.string({ required: true, enum: ["player", "staff"] }),
  place: Type.string({ required: true }),
  position: Type.string({ required: true }),
  photo: Type.string({ required: true }),
  history: Type.string(),
  date: Type.date({ default: Date.now }),
  birthday: Type.date({ default: Date.now }),
  deleted: Type.boolean({ default: false }),
});

const StructurePlayer = typedModel(
  "StructurePlayer",
  schema,
  undefined,
  undefined,
  {
    /**
     * Crea un jugador/staff para un equipo
     * @param {StructurePlayer} player
     * @returns
     */
    createOne(player) {
      return new StructurePlayer(player).save();
    },
    /**
     * Retorna todos los jugadores de un equipo
     * @param team _id team
     * @returns
     */
    getAllByTeam(team) {
      return StructurePlayer.find({ deleted: false, team });
    },
    /**
     * Obtiene la informacion de un jugador/staff
     * @param player
     * @returns
     */
    getOne(player) {
      return StructurePlayer.findOne({
        _id: player,
        deleted: false,
      })
        .populate("team")
        .populate({
          path: "team",
          populate: {
            path: "team",
            populate: { path: "category", populate: { path: "division" } },
          },
        });
    },
    /**
     * Modifica un jugador
     * @param id _id del jugador
     * @param newData nueva data
     * @returns
     */
    updatePlayer(id, newData) {
      return StructurePlayer.findByIdAndUpdate(id, newData, { new: true });
    },
    /**
     * Eliminar un jugador
     * @param id
     * @returns
     */
    deletePlayer(id) {
      return StructurePlayer.findByIdAndUpdate(
        id,
        { deleted: true },
        { new: true }
      );
    },

    async createDefaultPlayers(team) {
      let one = new StructurePlayer({
        name: "Daniel Hernandez",
        position: "Entrenador",
        birthday: "24/04/1968",
        place: "Madrid, España",
        height: "1,76 m",
        photo: "assets/structure/staff2.jpg",
        role: "staff",
        team,
        history: "Cuerpo tecnico de muestra",
      });
      let two = new StructurePlayer({
        name: "Pepe Villa",
        position: "Portero",
        birthday: "31/12/1999",
        place: "Caracas, Venezuela",
        height: "1,70 m",
        photo: "assets/structure/player2.jpg",
        role: "player",
        team,
        history: "Jugador de muestra",
      });

      await one.save();
      await two.save();
    },
  }
);

/**
 * Exporta el modelo
 */
export default StructurePlayer;
