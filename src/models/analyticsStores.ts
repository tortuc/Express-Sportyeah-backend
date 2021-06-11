import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Define el esquema del modelo para la analitica de los clics a los botones de las tiendas de apps
 */
const schema = createSchema({
 /**
  * Tipo de tienda, si google play o la play store
  */
  type: Type.string({
    enum: ["google-play", "app-store"],
    default: "google-play",
  }),
  /**
   * Si tocaron en un boton de la lista de regalos
   */
  giftlist: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * Si tocaron en un boton en una publicacion
   */
  post: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * Si tocaron en un boton en un perfil
   */
  profile: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * Si tocaron en un boton en un evento
   */
  event: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * Si tocaron en un boton en la landing page
   */
  landing: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * Si tocaron en un boton en el login
   */
  login: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * Si tocaron en un boton en la pagina de verificacion
   */
  verification: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * fecha en que se toco un boton
   */
  date: Type.date({ default: Date.now }),
});

const AnalyticStore = typedModel(
  "AnalyticStore",
  schema,
  undefined,
  undefined,
  {
    /**
     * Retorna toda la data, o analitica de veces que se redirigio a la appstore desde que lugar
     */
    getAllData() {
      return AnalyticStore.aggregate([
        {
          $group: {
            _id: "$type",
            giftlist: { $sum: "$giftlist" },
            post: { $sum: "$post" },
            profile: { $sum: "$profile" },
            event: { $sum: "$event" },
            landing: { $sum: "$landing" },
            login: { $sum: "$login" },
          },
        },
      ]);
    },
    /**
     * agrega un clic al boton de la lista de regalos
     */
    giftlist(type) {
      return new AnalyticStore({ type, giftlist: 1 }).save();
    },
    /**
     *  agrega un clic al boton de la pagina de verificacion
     */
    verification(type) {
      return new AnalyticStore({ type, verification: 1 }).save();
    },
    /**
     *  agrega un clic al boton de una publicacion
     */
    post(type) {
      return new AnalyticStore({ type, post: 1 }).save();
    },
    /**
     *  agrega un clic al boton de un perfil publico
     */
    profile(type) {
      return new AnalyticStore({ type, profile: 1 }).save();
    },
    /**
     *  agrega un clic al boton de una landing evento
     */
    event(type) {
      return new AnalyticStore({ type, event: 1 }).save();
    },
    /**
     *  agrega un clic al boton de la landing page
     */
    landing(type) {
      return new AnalyticStore({ type, landing: 1 }).save();
    },
    /**
     *  agrega un clic al boton de el login
     */
    login(type) {
      return new AnalyticStore({ type, login: 1 }).save();
    },
  }
);

/**
 * Exporta el modelo
 */
export default AnalyticStore;
