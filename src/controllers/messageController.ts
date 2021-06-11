import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import Message from "../models/message";
import { Socket } from "../helpers/socket";
import { MessageHelper } from "../helpers/messageHelper";
import Chat from "../models/chat";

/**
 * MessageController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class MessageController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Guardar mensaje
   *
   * @route /v1/message/save
   * @method post
   */
  public saveMessage(request: Request, response: Response) {
    let user = request.body.decoded.id;
    // obtenemos el cuerpo del mensaje
    let message = request.body;
    // el creador del mensaje, es el usuario que hace la peticion, por lo tanto se asigna el decoded.id al message.user
    message.user = user;
    // eliminamos el decoded, porque no lo necesitamos
    delete message.decoded;
    // creamos el mensaje
    Message.createMessage(message)
      .then(async (msg: any) => {
        // recuperamos el chat
        let chat = await Chat.findById(msg.chat);
        // declaramos un array para los id del los usuarios
        let users = [];
        // si el chat es grupal, se avisa a todos los participantes
        if (chat.group) {
          users = chat.users;
        } else {
          // si es chat privado, verificamos quien envio el mensaje, y a quien debe llegarle la notificacion
          if (chat.sender == user) {
            users.push(chat.receiver);
          } else {
            users.push(chat.sender);
          }
        }

        // enviamos la notificacion
        MessageHelper.sendNotificationTo(users, msg);
        // respondemos con el mensaje creado
        response.status(HttpResponse.Ok).json(msg);
      })
      .catch((err) => {
        console.log(err);

        response.status(HttpResponse.InternalError).send("cannot save message");
      });
  }

  /**
   * Obtiene todos los mensajes de un chat
   */
  public getMessagesByChat(request: Request, response: Response) {
    // obtenemos el id del usuario que hace la peticion
    let user = request.body.decoded.id;
    // obtenemos el id del chat
    let { id } = request.params;
    // obtenemos los mensajes del chat
    // para hacer la paginacion
    let skip = Number(request.params.skip);
    Message.getMessagesFromChat(id, user, skip)
      .then((messages) => {
        messages = messages.reverse();
        // retornamos todos los mensajes
        response.status(HttpResponse.Ok).json(messages);
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("cannot get messages");
      });
  }

  /**
   * Borrar un mensaje
   */

  public deleteOne(request: Request, response: Response) {
    // obtenemos el id del mensaje
    let { id } = request.params;
    Message.deleteMessage(id)
      .then((resp) => {
        // respondemos que se elimino
        response.status(HttpResponse.Ok).send({ msg: "deleted" });
      })
      .catch((err) => {
        response
          .status(HttpResponse.InternalError)
          .send("cannot delete the message");
      });
  }

  /**
   * Marcar varios mensajes como leidos
   */

  public readMessages(request: Request, response: Response) {
    // obtenemos solos los ids de de los mensajes
    let ids = request.body.messages.map((message) => {
      return (message = message._id);
    });

    Message.readMessages(ids).then((messages) => {
      // retornamos los ids de los mensajes leidos
      Socket.IO.to(request.body.chat).emit("reads", { messages: ids });
    });

    response.status(200).send({ msg: "read" });
  }

  /**
   * Vaciar un chat de mensajes (solo para el usuario que los vacio)
   */

  public clearChat(request: Request, response: Response) {
    // obtenemos el id del chat
    let chat = request.params.id;
    // y el id del usuario
    let user = request.body.decoded.id;
    // marcamos todos los mensajes actuales como vaciado, asi los nuevos mensajes que lleguen se veran
    Message.clearChat(chat, user)
      .then((messages) => {
        response.status(HttpResponse.Ok).json({ ok: true });
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("cannot clear chat");
      });
  }
}
