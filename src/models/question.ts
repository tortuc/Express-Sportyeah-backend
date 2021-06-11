import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de conexión
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
  user: Type.objectId({ ref: "User", required: true }),
  finishVotes: Type.date({ default: undefined }),
  notified: Type.boolean({ default: false }),
  date: Type.date({ default: Date.now }),
  deleted: Type.boolean({ default: false }),
  edited: Type.date({ defualt: null }),
});

const Question = typedModel("Question", schema, undefined, undefined, {
  /**
   * Crea un question
   * @param {string} user
   *
   */
  create(user, finishVotes) {
    return new Question({ user, finishVotes }).save();
  },

  findQuestion() {
    return (
      Question.find({ deleted: false })
        .populate("user")
        .sort({ date: -1 })
        //.skip(skip)
        .limit(10)
    );
  },

  findOneQuestion(id) {
    return Question.findById(id).populate("user");
  },

  /**
   * Obtiene los Question de un usuario
   * @param user Id del usuario
   */
  findMyQuestions(user) {
    return (
      Question.find({ user, deleted: false })
        .populate("user ")
        .sort({ date: -1 })
        //.skip(skip)
        .limit(10)
    );
  },

  updateQuestion(id, newValues) {
    return Question.findByIdAndUpdate(id, newValues);
  },

  /**
   * Elimina un Question
   * @param id ID del Question a eliminar
   */
  deleteOneById(id) {
    return Question.findByIdAndUpdate(id, { deleted: true });
  },

  notifiedTrue(question) {
    return Question.findByIdAndUpdate(question, { notified: true });
  },
});

/**
 * Exporta el modelo
 */
export default Question;
