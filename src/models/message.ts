import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de Message
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
   * _id del chat donde se envio el mensaje
   */
  chat: Type.objectId({ required: true, ref: "Chat" }),
  /**
   * _id del usuario que mando el mensaje
   */
  user: Type.objectId({ required: true, ref: "User" }),
  /**
   * mensaje del mensaje
   */
  message: Type.string(),
  /**
   * Informacion del mensaje, para mostrar mejor informacion al compartir algo internamente en el app
   */
  information: Type.mixed({ default: null }),
  /**
   * Si envio una imagen
   */
  files: Type.array({ default: [] }).of({
    format: Type.string({
      required: true,
      enum: ["image", "video", "document", "link"],
    }),
    name: Type.string({ default: "" }),
    url: Type.string({ required: true }),
  }),
  /**
   * Si envio un audio
   */
  audio: Type.string({ default: null }),

  /**
   * Fecha del mensaje
   */
  date: Type.date({ default: Date.now }),
  /**
   * Si ha sido borrado
   */
  deleted: Type.boolean({ default: false }),
  /**
   * Si lo leyeron
   */
  read: Type.boolean({ default: false }),
  /**
   * Quienes lo leyeron
   */
  reads: [Type.objectId({ ref: "User" })],
  /**
   * Quienes borraron el mensaje
   */
  deleteds: [Type.objectId({ ref: "User" })],
});

const Message = typedModel("Message", schema, undefined, undefined, {
  /**
   * Crea un mensaje
   *
   * @param {message} message Cuerpo del mensaje
   */

  async createMessage(message) {
    return new Promise(async (resolve, reject) => {
      (await new Message(message).save()).populate("user", (err, message) => {
        if (err) {
          reject("cannot create message");
        } else {
          resolve(message);
        }
      });
    });
  },
  /**
   * Obtiene el ultimo mensaje de un chat
   * @param {string} chat id del chat
   */
  findLastByChat(chat, user) {
    return Message.findOne({ chat, deleteds: { $ne: user } })
      .sort({ date: -1 })
      .limit(1)
      .populate("user");
  },
  /**
   * obtiene todos los mensajes de un chat
   * @param chat id del chat
   * @param user id del usuario que esta solicitando los mensajes
   */

  getMessagesFromChat(chat, user, skip) {
    return Message.find({ chat, deleteds: { $ne: user } })
      .sort({ date: -1 })
      .populate("user")
      .skip(skip)
      .limit(20);
  },
  /**
   * Elimina un mensaje
   * @param id
   */
  deleteMessage(id) {
    return Message.findByIdAndUpdate(id, { deleted: true });
  },
  /**
   * Cuenta la cantidad de mensajes sin leer
   * @param chat _id del chat
   * @param user _id del usuario
   * @returns
   */
  countUnReads(chat, user) {
    return Message.countDocuments({ chat, read: false, user: { $ne: user } });
  },
  /**
   * Marcar un mensaje como leido
   * @param messages _id del mensaje o mensajes
   * @returns
   */
  readMessages(messages) {
    return Message.updateMany(
      { _id: { $in: messages } },
      { read: true }
    ).populate("user");
  },
  /**
   * Retorna los ultimos 3 mensajes por chat
   * @param chat _id del chat
   * @returns
   */
  getLastThreeBychat(chat) {
    return Message.find({ chat })
      .sort({ date: -1 })
      .limit(3)
      .populate("user");
  },
  /**
   * Limpiar un chat, para que no se vean mensajes viejos
   * @param chat
   * @param user
   * @returns
   */
  clearChat(chat, user) {
    return Message.updateMany(
      { chat, deleteds: { $ne: user } },
      { $push: { deleteds: user } }
    );
  },
});

/**
 * Exporta el modelo
 */
export default Message;
