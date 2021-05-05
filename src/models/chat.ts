import { createSchema, Type, typedModel } from "ts-mongoose";

/**
 * Modelo de Chat
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
   * _id del usuario que crea el chat
   */
  sender: Type.objectId({ default: null, ref: "User" }),
  /**
   * _id del usuario con quien crearon el chat
   */
  receiver: Type.objectId({ default: null, ref: "User" }),

  /**
   * si el chat es grupal, o privado
   */
  group: Type.boolean({ default: false }),
  /**
   * privacidad del grupo, si es publica o privada
   */
  group_privacy: Type.string({ default: "private" }),
  /**
   * _id administradores del chat grupal
   */
  admins: [Type.objectId({ ref: "User" })],
  /**
   * _id de usuarios del chat
   */
  users: [Type.objectId({ ref: "User" })],
  /**
   * _id de Usuarios pendientes por ser aceptados a unirse al chat grupal
   */
  pending: [Type.objectId({ ref: "User" })],
  /**
   * _id de usuarios que han borrado el chat
   */
  deleteds: [Type.objectId({ ref: "User" })],
  /**
   * Imagen del chat
   */
  image: Type.string({
    default: "https://files.kecuki.com/v1/image/get/1616728941495",
  }),
  /**
   * Nombre del chat grupal
   */
  name: Type.string({ default: null }),
  /**
   * Fecha en la que se creo el chat grupal
   */
  date: Type.date({ default: Date.now }),
  /**
   * Si se cerro el chat grupal
   */
  closed: Type.boolean({ default: false }),
});

const Chat = typedModel("Chat", schema, undefined, undefined, {
  /**
   * Obtiene un chat donde el usuario y el amigo que selecciono sean el sender y receiver o viceversa
   *
   * @param {string} sender El id del usuario
   * @param {string} receiver El id del amigo
   */
  findChat(sender, receiver) {
    return Chat.findOne({
      sender: { $in: [sender, receiver] },
      receiver: { $in: [sender, receiver] },
    }).populate("sender receiver");
  },
  /**
   * Busca un chat donde el usuario y su amigo sean el sender y receiver
   * @param sender id del sender
   * @param receiver id del reciver
   */
  async createChat(sender, receiver) {
    return new Promise(async (resolve, reject) => {
      if (sender == receiver) {
        // si el sender es el mismo receiver no se puede crear el chat, porque se buguea todo el chat
        reject("cannot create chat");
      } else {
        (await new Chat({ sender, receiver }).save()).populate(
          "sender receiver",
          (err, chat) => {
            if (err) {
              reject("cannot create chat");
            } else {
              resolve(chat);
            }
          }
        );
      }
    });
  },
  /**
   * Retorna todos los chats donde el usuario sea sender o receiver o este en los usuarios de un grupo
   * @param user id del usuario
   */
  getChatsByUser(user) {
    return Chat.find({
      $or: [
        { sender: user },
        { receiver: user },
        { users: { $elemMatch: { $eq: user } } },
      ],
    }).populate("sender receiver users pending");
  },
  /**
   * Crea un chat grupal
   * @param chat
   */
  createGroup(chat) {
    chat.group = true;
    return new Chat(chat).save();
  },

  /**
   * Abandonar chat
   * @param user
   * @param chat
   */
  leaveChat(user, chat) {
    return Chat.findOneAndUpdate(
      { _id: chat },
      { $pull: { users: user, admins: user } },
      { new: true }
    );
  },
  /**
   * Obtener chats que sean grupos publicos
   */
  getPublicGroups(user, query) {
    return Chat.find({
      group: true,
      group_privacy: "public",
      name: { $regex: new RegExp(query, "i") },
      users: { $ne: user },
    }).sort({ users: -1 });
  },
  /**
   * Obtener un chat por su Id
   * @param id
   */

  getChat(id) {
    return Chat.findById(id).populate("sender receiver users pending");
  },

  /**
   * Editar un chat
   * @param chat
   * @param data
   */
  editChat(chat, data) {
    return Chat.findByIdAndUpdate(chat, data, { new: true }).populate("users");
  },
  /**
   * Agregar un usuario o varios a un chat grupal
   * @param chat
   * @param users
   * @param pending
   */
  async addUsersGroup(chat, users, pending = false) {
    if (pending) {
      return Chat.findByIdAndUpdate(
        chat,
        { $addToSet: { pending: { $each: users } } },
        { new: true }
      ).populate("users pending");
    } else {
      return Chat.findByIdAndUpdate(
        chat,
        {
          $push: { users: { $each: users } },
          $pull: { pending: users[0]._id },
        },
        { new: true }
      ).populate("users pending");
    }
  },
  /**
   * Expulsar a un usuario
   * @param chat
   * @param user
   */
  kickUser(chat, user) {
    return Chat.findByIdAndUpdate(
      chat,
      { $pull: { users: user, admins: user } },
      { new: true }
    ).populate("users");
  },

  /**
   * Rechazar o aprobar peticion de un usuario para ingresar a un grupo
   * @param chat
   * @param user
   */
  handleGroupJoinRequest(chat, user, action) {
    switch (action) {
      case "true":
        return Chat.findByIdAndUpdate(
          chat,
          { $pull: { pending: user._id }, $addToSet: { users: user } },
          { new: true }
        ).populate("users pending");
        break;
      case "false":
        return Chat.findByIdAndUpdate(
          chat,
          { $pull: { pending: user._id }, $addToSet: { deleteds: user } },
          { new: true }
        ).populate("users pending");
        break;
    }
  },
  /**
   * convertir a un usuario en administrador del grupo
   * @param chat
   * @param user
   */
  makeAdmin(chat, user) {
    return Chat.findByIdAndUpdate(
      chat,
      { $push: { admins: user } },
      { new: true }
    ).populate("users");
  },
  /**
   * convertir a un  administrador del grupo en participante normal
   * @param chat
   * @param user
   */
  discardAdmin(chat, user) {
    return Chat.findByIdAndUpdate(
      chat,
      { $pull: { admins: user } },
      { new: true }
    ).populate("users");
  },

  /**
   * Verificar si el usuario es admin del grupo
   * @param id
   * @param user
   */
  verifyIsAdmin(id, user) {
    return Chat.findById(id, {
      admins: {
        $elemMatch: { $eq: user },
      },
    });
  },
});

/**
 * Exporta el modelo
 */
export default Chat;
