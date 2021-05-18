import { mongo, Types } from "mongoose";
import Friend from "../models/friend";
import Message from "../models/message";
import User from "../models/user";
import { Crypto } from "./crypto";
// import { HelperEvent } from "./helperEvent";
/**
 * Clase Usuario
 *
 * Contiene métodos útiles, para la creacion o datos de usuarios
 *
 * @author David V <davidvalorwork@gmail.com>
 * @copyright Retail Servicios Externos SL
 *
 */

export class userHelper {
  /**
   * El constructor
   */
  private constructor() {
    // Constructor Privado
  }

  /**
   * Esta funcion es para cuando se registra un usuario, que no tiene seguidos o seguidores, poder buscar usuarios populares o administradore y mostrarle contenido en el muro
   * @param id
   * @returns
   */
  static newUserPosts(id): any[] | PromiseLike<any[]> {
    // retornamos una promesa
    return new Promise((resolve) => {
      // buscamos a los usuarios con role admin
      User.find({ role: "admin" }).then(async (users) => {
        // una vez retornado, pasamos a los usuarios a esta funcion que nos retornara solo los objectIds
        let ids = await this.getOnlyIdOfUsers(users);
        // buscamos a los usuarios mas populares de sportyeah
        let popular = await this.fivePopulateUsers(id);
        // unimos los ids del admins mas los ids de los usuarios populares
        ids = ids.concat(await this.getOnlyIdOfUsers(popular));
        // retornamos los ids en la promesa
        resolve(ids);
      });
    });
  }

  /**
   * Crear una password numerica aleatoriamente
   * @returns
   */

  public static generateRandomPass(): { hash: string; pass: number } {
    // se genera una password
    const genericPassword = Math.floor(
      Math.random() * (1000000000 - 10000000 + 1) + 10000000
    );

    // retornamos la password con el hash para la base de datos y la password sin hash para el correo que se enviara al nuevo usuario generado
    return {
      hash: Crypto.hash(genericPassword.toString()),
      pass: genericPassword,
    };
  }

  /**
   * Una funcion de ayuda que genera un username con el nombre y numeros aleatorios
   * @param name
   * @returns
   */

  private static async getUserName(name): Promise<string> {
    // retornamos una promesa con el nombre de usuario
    return new Promise((resolve) => {
      resolve(`${name}${(Math.random() * 100).toFixed(0)}`);
    });
  }

  public static async generateUsername(user): Promise<string> {
    return new Promise(async (resolve) => {
      // con un ciclo while, verificamos si el usuario se genero
      let generate = false;
      while (generate == false) {
        // generamos el usuario
        let username = await this.getUserName(user.name);
        // verificamos si el usuario generado ya existe en la base de datos
        let userExist = await User.findByUsername(username);
        // si no existe retornamos en la promesa el nombre de usuario
        if (!userExist) {
          resolve(username);
          generate = true;
        }

        // si no existe volvemos a hacer todos los pasos hasta que genere un usuario correcto
      }
    });
  }

  /**
   * Obtiene a los 5 usuarios mas populares de Sportyeah
   * @param user id del usuario
   */
  public static async fivePopulateUsers(user) {
    // Primero obtenemos a los amigos del usuario (siguiendo)
    let myFollowings = (
      await Friend.find({ follower: user, deleted: false }).select("user _id")
    ).map((item) => {
      // Luego hacemos un map para solo devolver el ObjectId de cada siguiendo
      return item.user;
    });
    // Agregamos nuestro id al array
    myFollowings.push(Types.ObjectId(user));
    // Buscamos los usuarios mas populares que no se encuentren entre mi lista de amigos (o sea mi mismo usuario)
    let mostPopulars = await Friend.mostPopularUserToAdd(myFollowings);
    return (await User.populate(mostPopulars, { path: "_id" })).map((item) => {
      return item._id;
    });
  }

  public static async newGroupInfo(body) {
    // el usuario que crea el chat, es el admin
    let admin = body.decoded.id;
    // obtenemos los datos del grupo
    let group = body.group;
    // metemos al creador como un admin
    group.admins = [admin];
    // obtenemos los id del los usuarios que conformaran el grupo
    group.users = await this.getOnlyIdOfUsers(group.users);
    // agregamos tambien al admin o creador
    group.users.push(admin);

    return group;
  }

  /**
   * Retorna los objectIDS de un array de Users
   * @param users
   */
  static async getOnlyIdOfUsers(users: any[]): Promise<any[]> {
    return await new Promise((resolve, reject) => {
      // declaramos un array vacio, donde iran los _id de los usuarios
      let ids = [];
      // iterador de control para saber cuando se recorrio todo el array
      let j = 0;

      // si no hay usuarios retornamos el array vacio
      if (users.length == 0) {
        resolve([]);
      } else {
        // si hay usuario recorremos uno por uno
        users.forEach((user, i, arr: any[]) => {
          // y metemos en el array de ids el id del usuario
          ids.push(new mongo.ObjectID(user._id));
          // sumamos el iterador
          j += 1;
          if (j == arr.length) {
            // si el iterador es igual al tamanio del array de usuarios, retornamos el array de ids
            resolve(ids);
          }
        });
      }
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
