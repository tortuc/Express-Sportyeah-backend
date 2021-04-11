import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de Like
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 *
 * @link https://www.npmjs.com/package/ts-mongoose
 */

/**
 * Define el esquema del modelo
 */
const schema = createSchema({
  post: Type.objectId({ required: false, ref: "Post" }),
  news: Type.objectId({ default: null, required: false, ref: "News" }),
  question: Type.objectId({ ref: 'Question', required: false }),
  user: Type.objectId({ required: true, ref: "User" }),
  message: Type.string({ default: null }),
  image: Type.string({ default: null }),
  date: Type.date({ default: Date.now }),
  deleted: Type.boolean({ default: false }),
});

const Comment = typedModel("Comment", schema, undefined, undefined, {
  /**
   * Crea un comentario
   * @param comment
   */
  newComment(comment) {
    return new Comment(comment).save();
  },
  /**
   * Obtiene todos los comentarios de un post
   * @param post id del post
   */
  getCommentsByPost(post) {
    return Comment.find({ post, deleted: false })
      .populate("user question")
      .sort({ date: -1 });
  },
  /**
   * Borrar un comentario
   * @param id  id del comentario
   */
  deleteComment(id) {
    return Comment.findByIdAndUpdate(id, { deleted: true });
  },
  /**
   * Editar un comentario
   * @param id id del comentario
   * @param comment comentario con los nuevos datos
   */
  updateComment(id, comment) {
    return Comment.findByIdAndUpdate(id, comment);
  },
  /**
   * Devuelva la informacion de un comentario
   * @param id `_id` del Comment
   */
  getOneComment(id) {
    return Comment.findById(id).populate("user post question");
  },

  /** PRUEBA NEWS con comentarios
   * Obtiene todos los comentarios de un news
   * @param news id del news
   */
  getCommentsByNews(news) {
    return Comment.find({ news, deleted: false })
      .populate("user question")
      .sort({ date: -1 });
  },
  getCommentAllTime() {
    return Comment.aggregate([
      { $match: { post: { $ne: null }, deleted: { $eq: false } } },
      {
        $group: {
          _id: "$post",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
  },
  getCommentByTime(start, end) {
    let startTime = new Date(start);
    let endTime = new Date(end);
    return Comment.aggregate([
      {
        $match: { post: { $ne: null }, deleted: { $eq: false },date: { $gte: startTime, $lte: endTime } },
        
      },
      {
        $group: {
          _id: "$post",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
  },
});

/**
 * Exporta el modelo
 */
export default Comment;
