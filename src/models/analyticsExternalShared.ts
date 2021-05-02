import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Define el esquema del modelo de las analiticas de las comparticiones al exterior
 */
const schema = createSchema({
  /**
   * Enlace compartido al exterior  por dispositivo movil
   */
  mobile: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * Enlace compartido al exterior por whatsapp
   */
  whatsapp: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * Enlace compartido al exterior por facebook
   */
  facebook: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * Enlace compartido al exterior por linkedin
   */
  linkedin: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * Enlace compartido al exterior por twitter
   */
  twitter: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * Enlace copiado en el clipboard
   */
  copy: Type.number({ enum: [0, 1], default: 0 }),
  /**
   * Fecha de comparticion del enlace
   */
  date: Type.date({ default: Date.now }),
});

const AnalyticExternalShared = typedModel(
  "AnalyticExternalShared",
  schema,
  undefined,
  undefined,
  {
    /**
     * Retorna la data o la suma de todas las comparticiones que se han hecho al exterior, y su respectivo canal
     * @returns
     */
    getData() {
      return AnalyticExternalShared.aggregate([
        {
          $group: {
            _id: null,
            mobile: { $sum: "$mobile" },
            whatsapp: { $sum: "$whatsapp" },
            facebook: { $sum: "$facebook" },
            linkedin: { $sum: "$linkedin" },
            twitter: { $sum: "$twitter" },
            copy: { $sum: "$copy" },
            total: { $sum: 1 },
          },
        },
      ]);
    },
    /**
     * agrega o suma uno al conteo de las comparticiones al exterior mediante mobile
     */
    addMobile() {
      return new AnalyticExternalShared({ mobile: 1 }).save();
    },
    /**
     * agrega o suma uno al conteo de las comparticiones al exterior mediante whatsapp
     */
    addWhatsapp() {
      return new AnalyticExternalShared({ whatsapp: 1 }).save();
    },
    /**
     * agrega o suma uno al conteo de las comparticiones al exterior mediante facebook
     */
    addFacebook() {
      return new AnalyticExternalShared({ facebook: 1 }).save();
    },
    /**
     * agrega o suma uno al conteo de las comparticiones al exterior mediante linkedin
     */
    addLinkedin() {
      return new AnalyticExternalShared({ linkedin: 1 }).save();
    },
    /**
     * agrega o suma uno al conteo de las comparticiones al exterior mediante twitter
     */
    addTwitter() {
      return new AnalyticExternalShared({ twitter: 1 }).save();
    },
    /**
     * agrega o suma uno al conteo de las comparticiones al exterior mediante copy
     */
    addCopy() {
      return new AnalyticExternalShared({ copy: 1 }).save();
    },
  }
);

/**
 * Exporta el modelo
 */
export default AnalyticExternalShared;
