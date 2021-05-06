import { mongo } from "mongoose";
import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de Like
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
  post: Type.objectId({ required: false, ref: "Post" }),
  news: Type.objectId({ default: null, required: false, ref: "News" }),
  user: Type.objectId({ required: true, ref: "User" }),
  date: Type.date({ default: Date.now }),
  type: Type.number({ required: true }),
  deleted: Type.boolean({ default: false }),
});

const Like = typedModel("Like", schema, undefined, undefined, {
  /**
   * Da like a un post, si ya existe una reaccion eliminada, con el mismo post y el mismo user, se reactiva
   * @param like Dar like a un Post
   */
   async addLike(like) {
    let oldLike = await Like.findOneAndUpdate(
      { post: like.post, user: like.user, deleted: true },
      { deleted: false, type: like.type },
      { new: true }
    );
    if (oldLike) {
      return oldLike;
    } else {
      return new Like(like).save();
    }
  },

  getLikesByPost(post) {
    return Like.countDocuments({ post, deleted: false });
  },
  dislike(id) {
    return Like.findByIdAndUpdate(id, { deleted: true });
  },
  getLike(id) {
    return Like.findById(id).populate("post user");
  },

  //Prueba de likes en noticias
  getLikesByNews(news) {
    return Like.find({ news, deleted: false }).populate("user");
  },
  /**
   * Retorna 15 reacciones, de cualquier tipo en un post
   * @param post
   * @param skip
   * @returns
   */
  allReactionsPostUsers(post, skip) {
    return Like.find({ post, deleted: false })
      .populate("user")
      .skip(skip)
      .limit(15)
      .sort({ date: -1 });
  },
   /**
   * Retorna 15 reacciones de un solo tipo
   * 1 = likes
   * 2 = me encantas
   * 3 = me diviertes
   * 4 = me asombras
   * 5 = me entristece 
   * 6 = me enojas
   * @param post 
   * @param type 
   * @param skip 
   * @returns 
   */
    reactionsByTypePostUsers(post,type,skip){
      return Like.find({post,deleted:false,type}).populate('user').skip(skip).limit(10).sort({date:-1})
    },
       /**
   * Retorna la cantidad de likes que ha recibido un usuario
   * @param user _id del usuario
   * @returns
   */
        getCountLikeByUserPost(post:string[]) {
          return Like.countDocuments({ deleted: false, post:{$in:post} });
        },

  getLikesAllTime() {
    return Like.aggregate([
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
  getLikesByTime(start, end) {
    let startTime = new Date(start);
    let endTime = new Date(end);
    return Like.aggregate([
      {
        $match: {
          post: { $ne: null },
          deleted: { $eq: false },
          date: { $gte: startTime, $lte: endTime },
        },
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
  /**
   * Retorna si un usuario reacciono a un post
   * @param post _id del post
   * @param user _id del usuario
   * @returns
   */
  userReactToPost(post, user) {
    return Like.findOne({ post, user, deleted: false });
  },
  /**
   * Cambia el tipo de una reaccion
   * @param id _id del like
   * @param type la nueva reaccion
   * @returns
   */
  changeReaction(id, type) {
    type = Number(type) || 1;
    return Like.findByIdAndUpdate(id, { type }, { new: true });
  },
  /**
   * Retorna la cantidad de reacciones por tipo, de un post
   * post _id
   */
  countTotalOfEachReaction(post) {
    return Like.aggregate([
      { $match: { post: { $eq: new mongo.ObjectId(post) }, deleted: false } },
      {
        $group: {
          _id: "$type",
          total: { $sum: 1 },
        },
      },
    ]);
  },
});

/**
 * Exporta el modelo
 */
export default Like;
