/**
 * Clase MessageHelper
 *
 * Contiene funciones para mejorar el sistema de mensajes
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 *
 * @link https://www.npmjs.com/package/bcrypt
 */

import { mongo } from "mongoose";
import { PushNotification } from "./pushNotification";
import { Socket } from "./socket";

export class MessageHelper {
  /**
   * El constructor es privado
   */
  private constructor() {
    // Constructor Privado
  }

  /**
   * Retorna los objectIDS de un array de Users
   * @param users
   */
  public static async getOnlyIdOfUsers(users) {
    return await new Promise((resolve, reject) => {
      let ids = [];
      let j = 0;

      users.forEach((user, i, arr: any[]) => {
        ids.push(new mongo.ObjectID(user._id));
        j += 1;
        if (j == arr.length) {
          resolve(ids);
        }
      });
    });
  }

  /**
   * Notifica que llego un mensaje
   * @param body
   * @param msg mensaje
   */
  public static async sendNotificationTo(users, msg) {
    // notificamos al chat si estan dentro, que llego un nuevo mensaje y le enviamos el mensaje
    Socket.IO.in(`${msg.chat}`).emit("new-msg", { msg });

    // si se le notifica a varios usuarios
    users.forEach((to) => {
      PushNotification.messagePushNotification(msg,to)
      Socket.findOneByIdUser(to)
        .then((user) => {
          Socket.IO.to(user.id).emit("msg", { msg });
        })
        .catch((err) => {
          // user no conected
        });
    });
  }
}
