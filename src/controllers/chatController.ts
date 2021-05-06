import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import Chat from "../models/chat";
import User from "../models/user";
import { userHelper } from "../helpers/userHelper";
import Message from "../models/message";

/**
 * ChatController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class ChatController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Verifica si ya existe un chat entre dos personas, si no existe se crea
   *
   * @route /v1/chat/create
   * @method post
   */
  public create(request: Request, response: Response) {
    Chat.findChat(request.body.decoded.id, request.body.user)
      .then((chat) => {
        if (chat) {
          // si existe el chat devuelve la info
          response.status(HttpResponse.Ok).json(chat);
        } else {
          // si no lo crea
          Chat.createChat(request.body.decoded.id, request.body.user)
            .then((chat) => {
              response.status(HttpResponse.Ok).json(chat);
            })
            .catch((err) => {
              response
                .status(HttpResponse.InternalError)
                .send("cannot create chat");
            });
        }
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("cannot get chat");
      });
  }

  /**
   * Retorna los chats de un usuario
   * el id del usuario viene en el `request.body.decoded.id` que viene en el token del jwt
   *
   * @route /v1/chat/user
   *
   */
  async findChats(request: Request, response: Response) {
    // obtenemos el id del usuario
    let user = request.body.decoded.id;

    let chats = await Chat.getChatsByUser(user);

    userHelper
      .chatsAndLastMessages(chats, user)
      .then((chatsLastMessage) => {
        response.status(HttpResponse.Ok).json(chatsLastMessage);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("unknow error");
      });
  }

  /**
   * Crear un chat grupal
   * @param request
   * @param response
   */
  public async createGroup(request: Request, response: Response) {
    // formateamos la informacion del grupo
    let group = await userHelper.newGroupInfo(request.body);

    // creamos el chat
    Chat.createGroup(group)
      .then((newGroup) => {
        User.populate(newGroup, { path: "users" }, (err, chat) => {
          response.status(HttpResponse.Ok).json(chat);
        });
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("cannot create group");
      });
  }

  /**
   * Abandonar un chat grupal
   */
  public leaveChat(request: Request, response: Response) {
    // id del chat
    let chat = request.params.id;
    // id del usuario
    let user = request.body.decoded.id;
    // abandonamos el chat
    Chat.leaveChat(user, chat)
      .then(async (chat) => {
        // si el chat se queda sin administradores y aun quedan usuarios entonces convertirmos a un usuario en administrador aleatoriamente o por lo menos al primero del chat
        if (chat.admins.length == 0 && chat.users.length > 0) {
          let first_user: any = chat.users[0];
          await Chat.makeAdmin(chat._id, first_user._id);
        }
        response.status(HttpResponse.Ok).json(chat);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot leave chat");
      });
  }

  /**
   * Obtener los grupos publicos por una busqueda
   */
  public getPublicGroups(request: Request, response: Response) {
    // obtenemos el id del usuario
    let user = request.body.decoded.id;
    // obtenemos la query
    let query = !request.params.query ? "" : request.params.query;
    // obtenemos los chats grupales donde el usuario no sea parte
    Chat.getPublicGroups(user, query)
      .then((groups) => {
        response.status(HttpResponse.Ok).json(groups);
      })
      .catch(() => {
        response
          .status(HttpResponse.BadRequest)
          .send("cannot get public groups");
      });
  }

  /**
   * Obtenemos la informacion de un chat
   */
  public getChat(request: Request, response: Response) {
    // recuperamos el id de un chat
    let id = request.params.id;
    Chat.getChat(id)
      .then((chat) => {
        response.status(HttpResponse.Ok).json(chat);
      })
      .catch(() => {
        response.status(HttpResponse.BadRequest).send("cannot get chat");
      });
  }
  /**
   * Editar un chat
   */
  public editChat(request: Request, response: Response) {
    // obtenemos la data del chat
    let data = request.body.data;
    // obtenemos el id del chat
    let chat = request.params.id;
    // editamos el chat con la nueva data
    Chat.editChat(chat, data)
      .then((modifiedChat) => {
        response.status(HttpResponse.Ok).json(modifiedChat);
      })
      .catch(() => {
        response.status(HttpResponse.BadRequest).send("cannot edit chat");
      });
  }

  /**
   * Agregar un usuario a un grupo
   */
  public addUsersToGroup(request: Request, response: Response) {
    // obtenemos el id del usuario
    let users = request.body.users;
    // obtenemos el id del chat
    let chat = request.params.id;
    // verificamos si hay que aprobar o no el ingreso
    var pending = request.body.pending || false;

    Chat.addUsersGroup(chat, users, pending)
      .then((modifiedChat) => {
        response.status(HttpResponse.Ok).json(modifiedChat);
      })
      .catch(() => {
        response.status(HttpResponse.BadRequest).send("cannot edit chat");
      });
  }

  /**
   * Expulsar a un usuario de un grupo de chat
   */

  public kickUserFromGroup(request: Request, response: Response) {
    // obtenemos al id del usaurio
    let user = request.params.user;
    // obtenemos el id del chat
    let chat = request.params.id;
    // lo sacamos del chat
    Chat.kickUser(chat, user)
      .then((modifiedChat) => {
        response.status(HttpResponse.Ok).json(modifiedChat);
      })
      .catch(() => {
        response.status(HttpResponse.BadRequest).send("cannot kick user");
      });
  }
  /**
   * Convetir a un usuario, como administrador de un grupo
   */
  public makeUserAdmin(request: Request, response: Response) {
    // obtenemos el id del usaurio
    let user = request.body.user;
    // obtenemos el id del chat
    let chat = request.params.id;
    // convertimos al usaurio en admin
    Chat.makeAdmin(chat, user)
      .then((modifiedChat) => {
        response.status(HttpResponse.Ok).json(modifiedChat);
      })
      .catch(() => {
        response.status(HttpResponse.BadRequest).send("cannot set user admin");
      });
  }

  /**
   * Descartamos a un usuario como admin de un grupo (le quitamos el rol del admin)
   */
  public discardAdmin(request: Request, response: Response) {
    // obtenemos el id del usuario
    let user = request.body.user;
    // obtenemos el id del chat
    let chat = request.params.id;
    Chat.discardAdmin(chat, user)
      .then((modifiedChat) => {
        response.status(HttpResponse.Ok).json(modifiedChat);
      })
      .catch(() => {
        response.status(HttpResponse.BadRequest).send("cannot set user admin");
      });
  }

  /**
   * Verificar si el usuario es admin de un grupo
   */
  public verifyIsAdmin(request: Request, response: Response) {
    // obtenemos el id del usuario
    let user = request.body.decoded.id;
    // obtenemos el id del chat
    let chatId = request.params.id;

    Chat.verifyIsAdmin(chatId, user)
      .then((modifiedChat) => {
        response.status(HttpResponse.Ok).json(modifiedChat);
      })
      .catch(() => {
        response
          .status(HttpResponse.BadRequest)
          .send("cannot verify user admin");
      });
  }

  /**
   * Rechaza o aprueba el ingreso de un usuario a un grupo
   */
  public handleGroupJoinRequest(request: Request, response: Response) {
    // obtenemos el id del grupo, y la accion
    let { id, action } = request.params;
    // obtenemos el id del usuario
    let user = request.body.user;

    Chat.handleGroupJoinRequest(id, user, action)
      .then((modifiedChat) => {
        response.status(HttpResponse.Ok).json(modifiedChat);
      })
      .catch(() => {
        response
          .status(HttpResponse.BadRequest)
          .send("cannot verify user admin");
      });
  }

  /**
   * Obtiene los ultimos mensajes de cada chat
   * @param chats array de chats
   * @param user usuario que hace la peticion
   * @returns
   */
  public static async chatsAndLastMessages(chats, user) {
    return new Promise((resolve, reject) => {
      // creamos un array donde ira la informacion de los chats
      let chatsLastMessage = [];
      // iterador de control
      let j = 0;

      // si no hay chats entonces devolvemos el array vacio
      if (chats.length == 0) {
        resolve(chatsLastMessage);
      } else {
        // si hay chats, los recorremos
        chats.forEach(async (chat, i, arr) => {
          // obtenemos el ultimo mensaje del chat
          let last = await Message.findLastByChat(chat._id, user);
          // obtenemos la cantidad de mensajes no leidos
          let unreads = await Message.countUnReads(chat._id, user);

          chatsLastMessage.push({
            chat,
            lastMessage: last,
            unreads,
          });

          j += 1; // este iterador se suma soloo despues que se pusheo el chat
          if (j == arr.length) {
            // si un chat no tiene ultimo mensaje, porque se borraron todos o por cualquier razon
            // estos se pondran aparte
            let noLastM = chatsLastMessage.filter((chat) => {
              return chat.lastMessage == null;
            });

            // los que si tienen un ultimo mensaje se quedan solos y se sortean

            chatsLastMessage = chatsLastMessage.filter((chat) => {
              return chat.lastMessage != null;
            });

            // aqui lo sorteamos
            chatsLastMessage.sort((a, b) => {
              if (a.lastMessage != null && b.lastMessage != null) {
                return (
                  b.lastMessage?.date.getTime() - a.lastMessage?.date.getTime()
                );
              } else {
                return a - b;
              }
            });

            // luego de que esten sorteados, los chats sin mensajes se uniran al final

            chatsLastMessage = chatsLastMessage.concat(noLastM);

            // retornamos los chats
            resolve(chatsLastMessage);
          }
        });
      }
    });
  }
}
