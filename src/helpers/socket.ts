/**
 * Clase Socket
 *
 * Contiene todas las funciones de Socket.io
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 *
 */
export interface UserSocket {
  id: string;
  idUser: string;
}
export interface NewsSocket {
  id: string;
  idUser: string;
}
import * as socketIO from "socket.io";
import User from "../models/user";

export class Socket {
  /**
   * El constructor
   */
  private constructor() {
    // Constructor Privado
  }

  private static users: UserSocket[] = [];
  private static news: NewsSocket[] = [];
  public static IO: socketIO.Server;

  /**
   * Para iniciar socket se le debe pasar un servidor http/https que normalmente se crea
   * en el helper `app.ts` en su funcion `run`
   * @param server Servidor de express
   */
  public static init(server) {
    console.log("conectando socket");
    this.IO = require("socket.io")(server, {
      cors: {
        origin: [
          "https://app.sportyeah.com",
          "https://admin.sportyeah.com",
          "https://www.sportyeah.com",
          "http://localhost:8100",
          "http://localhost:4200",
          "capacitor://localhost",
          "http://localhost",
          "https://test.sportyeah.com",
          "https://app-test.sportyeah.com",
          "https://admin-test.sportyeah.com",

        ],
        methods: ["GET", "POST"],
      },
    });
    this.IO.on("connection", (socket) => {
      socket.on("login", (data) => {
        this.pushUser(socket.id, data.user);
      });
      /**
       * Esta funcion se llama sola cuando un usaurio pierde la conexion en el front
       */
      socket.on("disconnect", () => {
        this.userDisconnet(socket.id);
      });

      /**
       * Un usuario se conecto a un chat
       * Este ingresa a una room que el nombre sera el mismo id del chat en la BD
       */

      socket.on("in-chat", (data) => {
        socket.join(data.chat);
      });
      /**
       * Un usuario se salio de un chat
       */
      socket.on("out-chat", (data) => {
        socket.leave(data.chat);
      });

      /**
       * Un usuario se conecto a un stream por noticia
       * Este ingresa a una room que el nombre sera el mismo id del news en la BD
       */

      socket.on("in-news", (data) => {
        socket.join(data.id);
      });
      /**
       * Un usuario se salio de un news
       */
      socket.on("out-news", (data) => {
        socket.leave(data.id);
      });
    });
  }

  /**
   * Cuando el cliente del front se conecta al socket, guardamos su id
   * @param socketID id del socket
   * @param userID  id del usuario
   */
  public static async pushUser(socketID, userID) {
    User.updateOne(userID, { connected: true })
      .then((user) => {
        this.users.push({
          id: socketID,
          idUser: userID,
        });
      })
      .catch((err) => {
        console.error(`[ERR] Hubo un error al intentar poner connected true`);
      });
  }

  /**
   * Cuando se pierde la conexion con el socket en el front, se elimina al usuario de `users`
   * @param id id del socketClient
   */
  private static userDisconnet(id) {
    let user = this.users.find((user) => {
      return user.id == id;
    });

    if (user) {
      User.updateOne(user.idUser, {
        connected: false,
        lastConection: new Date(),
      }).then((user) => {});
    }

    this.users = this.users.filter((user) => {
      return user.id != id;
    });
  }

  /**
   * Busca un usuario por su id de la BD de mongo
   * @param id id del usuario de la BD
   */

  public static async findOneByIdUser(id) {
    let userExist = await this.users.find((user) => {
      return user.idUser == id;
    });

    if (userExist) {
      return userExist;
    } else {
      throw "user no conneted";
    }
  }
}
