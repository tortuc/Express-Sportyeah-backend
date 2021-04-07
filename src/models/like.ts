import { response } from "express";
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
  user: Type.objectId({ required: true, ref: "User" }),
  date: Type.date({ default: Date.now }),
  type: Type.number({ required: true, enum: [1, 2, 3, 4, 5, 6], ref: "Type" }),
  deleted: Type.boolean({ default: false }),
});

const Like = typedModel("Like", schema, undefined, undefined, {
  /**
   * Da like a un post
   * @param like Dar like a un Post
   */
  addLike(like) {
    return new Like(like).save();
  },

  getLikesByPost(post) {
    return Like.find({ post, deleted: false }).populate("user");
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

  getLikesAllTime() {
    return Like.aggregate([
      { $match: { post: { $ne: null }, deleted: { $eq: false } } },
      {
        $group: {
          _id: "$post",
          count: { $sum: 1 }
          
        },
      },
      { $sort : { count : -1 } },
    ]);
  },
  getLikesByTime(start,end) {
      let startTime = new Date(start)
      let endTime = new Date(end)
    return Like.aggregate([
      { $match: { post: { $ne: null }, deleted: { $eq: false } , date:{$gte:startTime,$lte:endTime}} },
      {
        $group: {
          _id: "$post",
          count: { $sum: 1 }
        },
      },
      { $sort : { count : -1 } },
    ]);
  },
});

/**
 * Exporta el modelo
 */
export default Like;
