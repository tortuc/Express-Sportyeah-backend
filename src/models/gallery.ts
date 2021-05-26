import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de Galeria
 *
 * @author Samuel Lizarraga  <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 *
 * @link https://www.npmjs.com/package/ts-mongoose
 */

/**
 * Define el esquema del modelo
 */
const schema = createSchema({
  /**
   * Usuario a que pertenece el archivo
   */
  user: Type.objectId({ required: true, ref: "User" }),
  url: Type.string({ required: true }),
  format: Type.string({ required: true }),
  date: Type.date({ default: Date.now }),
  deleted: Type.boolean({ default: false }),
});

const Gallery = typedModel("Gallery", schema, undefined, undefined, {
  /**
   * Crea un nuevo archivo
   * @param file
   * @returns
   */
  createOne(file) {
    return new Gallery(file).save();
  },
  /**
   * Retorna la galeria de un usuario
   * @param id _Id del USer
   * @returns
   */
  getGalleryByUserID(id, skip) {
    return Gallery.find({ deleted: false, user: id })
      .populate("user")
      .sort({ date: -1 })
      .skip(skip)
      .limit(20);
  },
  /**
   * Eliminar un archivo de la galeria
   */
  deleteFile(id) {
    return Gallery.findByIdAndUpdate(id, { deleted: true }, { new: true });
  },
});

/**
 * Exporta el modelo
 */
export default Gallery;
