import { createSchema, Type, typedModel } from "ts-mongoose";
import Comment from "./comment";
import Like from "./like";

/**
 * Modelo de conexión
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
  /**
   * Usuario creador de la publicacion
   */
  user: Type.objectId({ ref: "User", required: true }),
  /**
   * Si la publicacion, es la comparticion de otra publicacion le pasamos el id de referencia de la publicacion compartida
   */
  post: Type.objectId({ ref: "Post", default: null }),
  /**
   * Si la publicacion es una noticia, le pasamos el id de referencia
   */
  news: Type.objectId({ default: null, required: false, ref: "News" }),
  /**
   * Si la publicacion tiene un cuestionario
   */
  question: Type.objectId({ ref: "Question", required: false }),
  /**
   * Mensaje o texto de la publicacion
   */
  message: Type.string(),
  /**
   * Archivos del post (imagenes y videos)
   */
  files: Type.array({ default: [] }).of({
    fileType: Type.string({ required: true }),
    url: Type.string({ required: true }),
  }),
  /**
   * Fecha en la cual se creo la publicacion
   */
  date: Type.date({ default: Date.now }),
  /**
   * Si la publicacion fue borrada o eliminada
   */
  deleted: Type.boolean({ default: false }),
  /**
   * Fecha en la que se edito la publicacion
   */
  edited: Type.date({ defualt: null }),
  /**
   * Cantidad de vistas que tuvo la publicacion
   */
  views: [Type.string({ default: 0 })],
});

const Post = typedModel("Post", schema, undefined, undefined, {
  /**
   * Crea un post
   * @param {Post} post
   */
  create(post) {
    return new Post(post).save();
  },

  /**
   * Obtiene todos los post
   */

  findAllPost() {
    return Post.find({ deleted: false })
      .populate("user post news")
      .populate({ path: "post", populate: { path: "user news" } })
      .sort({ date: -1 });
  },

  /**
   * Obtiene los post de los amigos
   *
   * @param {objectId[]}  friends Array de objectId de los usuarios amigos
   */

  findByFriends(friends: string[], skip) {
    return Post.find({ user: { $in: friends }, deleted: false })
      .populate("user post news")
      .populate({ path: "post", populate: { path: "user news" } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(10);
  },

  /**
   * Obtiene los Posts de un usuario
   * @param user Id del usuario
   */
  findMyPosts(user, regex, skip) {
    return Post.find({ deleted: false })
      .or([
        {
          user,
        },
        {
          message: { $regex: regex },
        },
      ])
      .populate("user post news")
      .populate({ path: "post", populate: { path: "user news" } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(10);
  },

  /**
   * Obtiene los post de un usuario
   *
   * @param {string} id Id del usuario
   */

  findByUser(id) {
    return Post.find({ user: id, deleted: false })
      .populate("user post news")
      .populate({ path: "post", populate: { path: "user news" } })
      .sort({ date: -1 })
      .limit(10);
  },

  /**
   * Elimina un post y todos sus comentarios y reacciones
   * @param id ID del post a eliminar
   */
  async deleteOneById(id) {
    await Like.updateMany({ post: id }, { deleted: true });
    await Comment.updateMany({ post: id }, { deleted: true });
    return Post.findByIdAndUpdate(id, { deleted: true });
  },
  /**
   * Modifica una publicacion
   * @param id 
   * @param newValues 
   * @returns 
   */
  updatePost(id, newValues) {
    return Post.findByIdAndUpdate(id, newValues);
  },
  /**
   * Retorna una publicacion
   * @param id 
   * @returns 
   */
  findOnePost(id) {
    return Post.findById(id)
      .populate("user post news question")
      .populate({ path: "post", populate: { path: "user news" } })
      .populate({ path: "news", populate: { path: "user" } });
  },
  /**
   * Retorna la cantidad de veces que se compartio una publicacion
   * @param id 
   * @returns 
   */
  getSharedsByPost(id) {
    return Post.find({ post: id })
      .populate("user post news")
      .populate({ path: "post", populate: { path: "user news" } })
      .sort({ date: -1 });
  }, //esto metelo en el newsCOntroller
  /**
   * Retorna la cantidad de veces qeu se compartio una noticia
   * @param id 
   * @returns 
   */
  getSharedsByNews(id) {
    return Post.find({ news: id })
      .populate("user post news")
      .populate({ path: "post", populate: { path: "user news" } })
      .sort({ date: -1 });
  },
  /**
   * Retorna la cantidad de publicaicones de un usuario
   * @param user 
   * @returns 
   */
  getCountPostByUser(user) {
    return Post.countDocuments({ deleted: false, user });
  },
  /**
   * Obtiene todas las publicaciones en un rango de fecha
   * @param start 
   * @param end 
   * @returns 
   */
  getPostsByDate(start, end) {
    let dayStart = new Date(start);
    let dayEnd = new Date(end);
    return Post.find({
      date: { $gte: dayStart, $lte: dayEnd },
      deleted: false,
    });
  },
  /**
   * Obtiene todos las comparticiones de una publicacion desde siempre 
   * @returns 
   */
  getPostAllTime() {
    return Post.aggregate([
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
  /**
   * Obtiene las comparticiones de una publicacion en un rango de fecha
   * @param start 
   * @param end 
   * @returns 
   */
  getPostByTime(start, end) {
    let startTime = new Date(start);
    let endTime = new Date(end);
    return Post.aggregate([
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
   * Obtiene la cantida de vistas en una publicacion en un rango de fecha
   * @param start 
   * @param end 
   * @returns 
   */
  getPostViewsByTime(start, end) {
    let startTime = new Date(start);
    let endTime = new Date(end);
    return Post.find({
      deleted: false,
      date: { $gte: startTime, $lte: endTime },
      $where: "this.views.length >= 1",
    }).sort({ views: -1 });
  },
  /**
   * Obtiene la cantida de vistas de todos los post, desde siempre
   * @returns 
   */
  getPostViewsAllTime() {
    return Post.find({
      deleted: false,
      $where: "this.views.length >= 1",
    }).sort({ views: -1 });
  },
  /**
   * Agrega una vista a una publicacion
   * @param id 
   * @param ip 
   * @returns 
   */
  newView(id, ip) {
    return Post.findByIdAndUpdate(id, { $push: { views: ip } }); //colocar en el controler el beta la ruta etc etc
  },
  /**
   * Busca si hay una ip registrada en la vista de una publicacion
   * @param id 
   * @param ip 
   * @returns 
   */
  findViewIp(id, ip) {
    return Post.findOne({ _id: id, views: { $elemMatch: { $eq: ip } } });
  },
});
/**
 * Exporta el modelo
 */
export default Post;
