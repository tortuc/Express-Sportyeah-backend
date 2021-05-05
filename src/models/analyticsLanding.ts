import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Define el esquema del modelo para las analiticas de la landing page
 * Cuantas personas la vieron, cuantos fueron al login, cuantos al registro
 */
const schema = createSchema({
  /**
   * Visita a la landing page
   */
  visit: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * Si redirigio al login
   */
  login: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * si redirigio al registro
   */
  signup: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * La fecha en que fue visitada
   */
  date: Type.date({ default: Date.now }),
});

const AnalyticLanding = typedModel(
  "AnalyticLanding",
  schema,
  undefined,
  undefined,
  {
    /**
     * Obtiene el registro o la data total de visitas, y redirecciones
     * @returns
     */
    getData() {
      return AnalyticLanding.aggregate([
        {
          $group: {
            _id: null,
            visits: { $sum: "$visit" },
            logins: { $sum: "$login" },
            signups: { $sum: "$signup" },
          },
        },
      ]);
    },
    /**
     * Agrega una visita a la lading page
     */
    addVisit() {
      return new AnalyticLanding({ visit: 1 }).save();
    },
    /**
     * Agrega una redireccion al login
     */
    addLogin() {
      return new AnalyticLanding({ login: 1 }).save();
    },
    /**
     * Agrega una redireccion al registro
     */
    addSignup() {
      return new AnalyticLanding({ signup: 1 }).save();
    },
  }
);

/**
 * Exporta el modelo
 */
export default AnalyticLanding;
