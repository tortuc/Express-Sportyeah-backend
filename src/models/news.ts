import moment = require("moment");
import { createSchema, Type, typedModel } from "ts-mongoose";
import { createFalse } from "typescript";

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
  question: Type.objectId({ ref: "Question", required: false }),
  headline: Type.string(),
  content: Type.array().of({
    subtitle: Type.string({}),
    parrafo: Type.string({ default: null }),
    position: Type.number({ required: true }),
    image: Type.string({ required: false }),
    video: Type.string({ default: null }),
    originMedia: Type.string({ default: null }),
    url: Type.string({ required: false }),
    link: Type.string({ required: false }),
    question: Type.string({ required: false }),
    format: Type.string({ required: false }),
  }),
  principalSubtitle: Type.string(),
  principalImage: Type.string(),
  principalVideo: Type.string(),
  principalYoutube: Type.string(),
  audioNews: Type.string(),
  originPrincipaMedia: Type.string({ default: null }),
  origin: Type.string({ default: null }),
  sport: Type.string({
    required: false,
    enum: [
      "soccer",
      "basketball",
      "tennis",
      "baseball",
      "golf",
      "running",
      "volleyball",
      "swimming",
      "boxing",
      "table tennis",
      "rugby",
      "football",
      "esport",
      "various",
    ],
  }),
  stream: Type.boolean({ default: false }),
  postStream: Type.string({ required: false, default: null }),
  date: Type.date({ default: Date.now }),
  pusblishDate: Type.date({ default: Date.now }),
  deleted: Type.boolean({ default: false }),
  privated: Type.boolean({ default: false }),
  programatedDate: Type.date({ default: null }),
  programated: Type.boolean({ default: false }),
  draftCopy: Type.boolean({ default: false }),
  edited: Type.date({ defualt: null }),
  views: [Type.string({ default: 0 })],
});

const News = typedModel("News", schema, undefined, undefined, {
  /**
   * Crea un news
   * @param {News} news
   *
   */
  create(news) {
    return new News(news).save();
  },

  findNews() {
    return (
      News.find({
        deleted: false,
        draftCopy: false,
        programated: false,
        stream: false,
      })
        .populate("user")
        .sort({ date: -1 })
        //.skip(skip)
        .limit(10)
    );
  },

  findNewsStreaming() {
    return (
      News.find({
        deleted: false,
        draftCopy: false,
        programated: false,
        stream: true,
      })
        .populate("user")
        .sort({ date: -1 })
        //.skip(skip)
        .limit(10)
    );
  },

  findOneNews(id) {
    return News.findById(id).populate("user question");
  },

  /**
   * Obtiene los News de un deporte
   *
   * @param sport deporte
   */

  findBySport(sport) {
    return (
      News.find({ sport, deleted: false, draftCopy: false, programated: false })
        .populate("user")
        .sort({ date: -1 })
        //.skip(skip)
        .limit(10)
    );
  },
  /**
   * Obtiene los News de un usuario
   * @param user Id del usuario
   */
  findMyNewss(user) {
    return (
      News.find({ user, deleted: false, draftCopy: false, programated: false })
        .populate("user")
        .sort({ date: -1 })
        //.skip(skip)
        .limit(10)
    );
  },

  /**
   * Obtiene los News de un usuario que han sido borradas
   * @param user Id del usuario
   */
  findMyNewsDeleted(user) {
    return (
      News.find({ user, deleted: true, programated: false })
        .populate("user")
        .sort({ date: -1 })
        //.skip(skip)
        .limit(10)
    );
  },

  /**
   * Obtiene los News de un usuario que son borradores
   * @param user Id del usuario
   */
  findMyNewsDraft(user) {
    return News.find({ user, deleted: false, draftCopy: true })
      .populate("user")
      .sort({ date: -1 })
      .limit(10);
  },

  /**
   * Obtiene los News de un usuario que han sido programados
   * @param user Id del usuario
   */
  findMyNewsProgramated(user) {
    return (
      News.find({ user, programated: true })
        .populate("user")
        .sort({ date: -1 })
        //.skip(skip)
        .limit(10)
    );
  },

  updateNews(id, newValues) {
    return News.findByIdAndUpdate(id, newValues);
  },

  /**
   * Elimina un News
   * @param id ID del News a eliminar
   */
  deleteOneById(id) {
    return News.findByIdAndUpdate(id, { deleted: true });
  },

  /**
   *  Restaura un News
   * @param id ID del News a restaurar
   */
  restoreOneById(id) {
    return News.findByIdAndUpdate(id, { deleted: false });
  },

  /* getCountNewsByUser(user){
        return News.countDocuments({deleted:false,user})
    } */

  getSharedsByNews(id) {
    return News.find({ news: id })
      .populate("user news")
      .populate({ path: "news", populate: { path: "user" } })
      .sort({ date: -1 });
  },

  newView(id, ip) {
    return News.findByIdAndUpdate(id, { $push: { views: ip } });
  },
  findViewIp(id, ip) {
    return News.findOne({ _id: id, views: { $elemMatch: { $eq: ip } } });
  },

  rescheduleNews(id, date) {
    return News.findByIdAndUpdate(id, { programatedDate: date });
  },

  published(id) {
    return News.findByIdAndUpdate(id, { programated: false });
  },
  totalNewsToday() {
    let start = new Date(new Date().setUTCHours(0, 0, 0, 0));
    let end = new Date(
      new Date(
        moment()
          .add(1, "day")
          .startOf("day")
          .format("YYYY-MM-DD HH:ss")
      ).setUTCHours(0, 0, 0, 0)
    );


    return News.countDocuments({
      deleted: false,
      date: { $gte: start, $lte: end },
    });
  },
});

/**
 * Exporta el modelo
 */
export default News;
