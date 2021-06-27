import { createSchema, Type, typedModel } from "ts-mongoose";
import Comment from "./comment";

/**
 * Modelo de tests
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
  /**
   * Usuario que hizo la denucnia
   */
  user: Type.objectId({ required: true, ref: "User" }),
  /**
   * Comentario denunciado
   */
  comment: Type.objectId({ required: false, ref: "Comment" }),
  /**
   * Razon de la denuncia
   */
  reason: Type.string({ required: true }),
  /**
   * Fecha de la denuncia
   */
  date: Type.date({ default: Date.now }),
  /**
   * Estado de la denuncia
   * 0 = Denuncia en revision
   * 1 = DENUNCIA CERRADA SIN ACCIONES
   * 2 = DENUNCIA CERRADA ELIMINANDO CONTENIDO
   */
  status: Type.number({ default: 0 }),

  deleted: Type.boolean({ default: false }),
});

const Report = typedModel("Report", schema, undefined, undefined, {
  /**
   *
   * @param report
   * @returns
   */
  newReport(report: any) {
    return new Report(report).save();
  },
  getPendingReports(skip) {
    return Report.find({ status: 0, deleted: false })
      .sort({ date: -1 })
      .populate("comment user")
      .populate({ path: "comment", populate: { path: "user" } })
      .skip(skip)
      .limit(25);
  },
  getOneReport(id) {
    return Report.findById(id)
      .populate("comment user")
      .populate({ path: "comment", populate: { path: "user" } });
  },
  makeReportCloseWithoutActions(id) {
    return Report.findByIdAndUpdate(id, { status: 1 }, { new: true })
      .populate("comment user")
      .populate({ path: "comment", populate: { path: "user" } });
  },
  async makeReportCloseAndDeletedComment(id) {
   
    return Report.findByIdAndUpdate(id, { status: 2 }, { new: true })
      .populate("comment user")
      .populate({ path: "comment", populate: { path: "user" } });
  },
  async deleteAllReportByComment(comment) {
    await Report.updateMany({ comment }, { deleted: true });
    return true;
  },
});

/**
 * Exporta el modelo
 */
export default Report;
