/**
 * Clase PushNotification
 *
 * Push notifications para la app
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 *
 * para mas informacion acerca de FCM visitar
 * https://firebase.google.com/docs/cloud-messaging/send-message
 */

import * as path from "path";

import * as admin from "firebase-admin";
import User from "../models/user";

var serviceAccount = require(path.resolve(
  __dirname + "/../serviceAccountKey.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export class PushNotification {
  /**
   * El constructor
   */
  private constructor() {
    // Constructor Privado
  }

  /**
   * Envia la push notification
   * @param token // token del dispositivo a enviar la push
   * @param notification // cuerpo de la notificacion, sirve para ios y android
   * @param data  // la data que envia la notificacion
   * @param image  // imagen si se tiene que enviar
   */

  private static sendPush(
    token,
    notification: admin.messaging.Notification,
    data,
    image = ""
  ) {
    let androidNotification: admin.messaging.AndroidNotification = {
      defaultSound: true, // si el sonido por defecto
      visibility: "public", // que sea publico
      priority: "high", // prioridad alta
      channelId: "kecuki_channel", // canal de kecuki, donde se reciben la mayoria de las notificaciones push
      notificationCount: 1,
      sound: "notification.wav",
    };

    if (image) {
      androidNotification.imageUrl = image;
    }
    // creamos un mensaje
    var message: admin.messaging.Message = {
      //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      token, // token del dispositivo
      notification, // notificacion con el title y el body
      data,
      android: {
        notification: androidNotification,
        ttl: 20000,
        collapseKey: "com.kecuki.app",
      },
    };

    admin
      .messaging()

      .send(message)
      .then((resp) => {
        console.log("success", resp);
      })
      .catch((e) => {
        console.log("err", e);
      });
  }

  /**
   * Envia una push notification al usuario indicando que alguien reacciono a su publicación
   * @param user // cuerpo del usuario que ha comentado
   * @param token // token del usuario a quien se le avisara
   * @param lang // lenguaje con el que se notificara
   * @param post // _id del post al que se comento
   */

  public static reactionNotification(user, token, lang, post: string) {
    let title = `${user.name} ${user.last_name}`;
    let body = "Ha reaccionado a una de tus publicaciónes";

    let notification = {
      title,
      body,
    };
    let data = {
      action: "post",
      post: `${post}`,
    };
    this.sendPush(token, notification, data);
  }

  /**
   * Envia una push notification al usuario indicando que alguien compartio  su publicación
   * @param user // cuerpo del usuario que ha compartido la publicación
   * @param token // token del usuario a quien se le avisara
   * @param lang // lenguaje con el que se notificara
   * @param post // _id del post que se compartio
   */

  public static async sharedNotification(userId, token, lang, post) {
    let user = await User.findById(userId);
    let title = `${user.name} ${user.last_name}`;
    let body = "Ha compartido una de tus publicaciónes";
    let notification = {
      title,
      body,
    };
    let data = {
      action: "post",
      post: `${post}`,
    };
    this.sendPush(token, notification, data);
  }
  /**
   * Envia una push notification al usuario indicando que alguien commento  su publicación
   * @param user // _id del usuario que ha reaccionado
   * @param token // token del usuario a quien se le avisara
   * @param lang // lenguaje con el que se notificara
   * @param post // _id del post al que se reacciono
   */

  public static async commentNotification(userId, token, lang, post) {
    let user = await User.findById(userId);
    let title = `${user.name} ${user.last_name}`;
    let body = "Ha comentado una de tus publicaciónes";

    let notification = {
      title,
      body,
    };
    let data = {
      action: "post",
      post: `${post}`,
    };
    this.sendPush(token, notification, data);
  }

  /**
   * Envia una push notification al usuario indicando que alguien commento  su publicación
   * @param user // cuerpo del usuario que ha mencionado al otro usuario
   * @param token // token del usuario a quien se le avisara que lo mencionaron
   * @param lang // lenguaje con el que se notificara
   * @param post // _id del post en el que se menciono al usuario
   */

  public static mentionCommentNotification(user, token, lang, post) {
    let title = `${user.name} ${user.last_name}`;
    let body = "Te ha mencionado en una comentario";
    let notification = {
      title,
      body,
    };
    let data = {
      action: "post",
      post: `${post}`,
    };
    this.sendPush(token, notification, data);
  }
  /**
   * Envia una push notification al usuario indicando que alguien commento  su publicación
   * @param user // cuerpo del usuario que ha mencionado al otro usuario
   * @param token // token del usuario a quien se le avisara que lo mencionaron
   * @param lang // lenguaje con el que se notificara
   * @param post // _id del post en el que se menciono al usuario
   */

  public static mentionPostNotification(user, token, lang, post) {
    let title = `${user.name} ${user.last_name}`;
    let body = "Te ha mencionado en una publicación";
    let notification = {
      title,
      body,
    };
    let data = {
      action: "post",
      post: `${post}`,
    };
    this.sendPush(token, notification, data);
  }

  
 
 


  /**
   * Push notificacion para los mensajes del chat
   * @param message cuerpo del mensaje
   * @param user usuario que recibe la push notification
   */

  public static async messagePushNotification(data, idUser) {
    let msg = data.message;
    let sender = data.user;
    let img = data.files.find((x) => x.format == "image");
    let user = await User.findById(idUser);

    if (user.fcmtoken && (msg || img)) {
      let title = `${sender.name} ${sender.last_name}`;
      let body = msg;
      let notification = {
        title,
        body,
      };

      let messageData = {
        action: "chat",
        chat: `${data.chat}`,
      };

      this.sendPush(user.fcmtoken, notification, messageData, img?.url);
    }
  }
}
