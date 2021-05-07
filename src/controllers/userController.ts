/**
 * UserController
 *
 * Controlador de usuarios
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";

/**
 * Modelos necesarios
 */
import User from "../models/user";
import Connection from "../models/connection";

/**
 * Clases de utilidad necesarias
 */
import { Web } from "../helpers/web";
import { Crypto } from "../helpers/crypto";
import { Net } from "../helpers/net";
import { Authentication } from "../routes/middleware/authentication";

/**
 * Controlador de envío de correos
 */
import { MailController as Mailer } from "./mailController";
import Post from "../models/post";
import Friend from "../models/friend";
import { userHelper } from "../helpers/userHelper";

export class UserController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Obtiene el usuario
   *
   * @route /v1/user/user
   * @method get
   */
  public user(request: Request, respose: Response) {
    console.log(request.body.decoded);
    
    // Obtiene el usuario
    User.findByUserId(request.body.decoded.id)
      .then((user) => {
        respose.status(HttpResponse.Ok).json({
          user,
        });
      })
      .catch((error) => {
        respose.status(HttpResponse.NotFound).json({
          error,
        });
      });
  }

  /**
   * Crea un usuario nuevo
   *
   * @route /v1/user/create
   * @method post
   */
  public async create(request: Request, response: Response) {
    // Crea el usuario

    console.log(request.body);
    
    let newUser = new User(request.body);

    // Codifica la contraseña
    newUser.password = Crypto.hash(newUser.password);

    // Define el token de verificación de la cuenta
    newUser.verification_token = Web.getToken();

    // Crea un nuevo usuario
    await User.create(newUser)
      .then((user) => {
        const validationLink: string = `${Web.getUrl()}/verification?token=${
          user.verification_token
        }`;

        // Si e menor de edad se debe de verificar
        if (user.parents_email != null) {
          // Envía el correo para la validación de la cuenta de el representante del usuario creado
          Mailer.verifyAccountParents(user, validationLink);
        } else {
          // Envía el correo para la validación de la cuenta de usuario creada
          Mailer.verifyAccount(user, validationLink);
        }

        // Envía la respuesta
        response.status(HttpResponse.Ok).json(user);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).json(error);
      });
  }

  /**
   * Reenvía la contraseña del usuario
   *
   * @route /v1/user/resend
   * @mathod post
   */
  public resend(request: Request, response: Response) {
    // Crea el usuario
    let user = new User(request.body);

    // El enlace para validar la cuenta
    const validationLink: string = `${Web.getUrl()}/verification?token=${
      user.verification_token
    }`;

    // Envía el correo para la validación de la cuenta de usuario creada
    Mailer.verifyAccount(user, validationLink);

    response.status(HttpResponse.Ok).json(user);
  }

  /**
   * Autentica el usuario
   *
   * @route /v1/user/auth
   * @method post
   */
  public auth(request: Request, response: Response) {
    let email: string = request.body.email;
    let password: string = request.body.password;

    User.auth(email, password)
      .then((user) => {
        // Se comprueba si las contraseñas coinciden
        if (Crypto.compare(password, user.password)) {
          if (!user.verified) {
            response.status(HttpResponse.Unauthorized).json(user);
          } else {
            // El usuario se ha autenticado éxito

            // Crea la sesión
            const token = Authentication.token(user);

            // Poner a cero el número de intentos fallidos
            User.resetAccessAttemps(user).catch((error) => {
              console.error(`[ERROR] ${error}`);
            });

            // Guardar la conexión con los datos de geolocalización
            let geo = Net.geoIp(Net.ip(request));

            if (geo) {
              geo.user = user._id;
              Connection.create(geo);
              Connection.diferentIp(geo).catch((error) => {
                // Envía el coreo de acceso desconocido
                Mailer.unknowAccess(user, geo, Web.getUrl());

                console.error(`[ERROR] ${error}`);
              });
            }

            response.status(HttpResponse.Ok).json(token);
          }
        } else {
          // Se ha fallado la contraseña

          User.incrementAccessAttemps(user)
            .then((attempts) => {
              console.warn(
                `[WARN] Error al autenticar al usuario ${user.email}. Número de intentos ${attempts}`
              );

              if (attempts >= 3) {
                // Obtiene los datos de geolocalización
                let geo = Net.geoIp(Net.ip(request));

                // Envía el correo de intento fallido
                Mailer.attempFailed(user, geo, Web.getUrl());
              }
            })
            .catch((error) => {
              console.error(`[ERROR] ${error}`);
            });

          response.status(HttpResponse.Forbidden).send("Access-Denied");
        }
      })
      .catch((error) => {
        response.status(HttpResponse.NotFound).json(error);
      });
  }

  /**
   * Verifica la cuenta de usuario creada
   * con el token que ha sido enviado previamente por correo
   *
   * @route /v1/user/verifyAccount
   * @method post
   */
  public verifyAccount(request: Request, response: Response) {
    // Obtiene el token de verificación
    let token: string = request.body.token;

    User.verification(token)
      .then((user) => {
        // Envía el correo de una nueva ha sido creada al administrador del sitio
        Mailer.newAccountCreated(user, Web.getUrl());

        // Crea el token de sesión JWT y lo devuelve
        const token = Authentication.token(user);

        response.status(HttpResponse.Ok).json(token);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).json(error);
      });
  }

  /**
   * Cambia la contraseña del usuario
   *
   * @param {Request}  request
   * @param {Response} response
   */
  public newPassword(request: Request, response: Response) {
    // Obtiene el token y la contraseña (que se condifica)
    let token: string = request.body.recover_password_token;
    let password: string = Crypto.hash(request.body.password);
    // Cambia la contraseña del usuario de token dado
    User.newPassword(token, password)
      .then((user) => {
        if (user) {
          response.status(HttpResponse.Ok).json(user);
        } else {
          response.status(HttpResponse.NotFound).send("no-found");
        }
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).json(error);
      });
  }

  /**
   * Envía el correo de recordatorio de la contraseña
   *
   * @param {Request}  request
   * @param {Response} response
   */
  public forgot(request: Request, response: Response) {
    // Obtiene el usuario a partir del email y actualiza l token de recuperar contraseña
    // para cambiar lam contraseña
    const token = Web.getToken(); // generamos el token que le enviamos al model

    User.forgot(request.body.email, token)
      .then((user) => {
        // Enviamos la Url con el mismo token generado
        const newPasswordUrl: string = `${Web.getUrl()}/newpassword?token=${token}`;

        Mailer.recoveryPassword(user, newPasswordUrl);

        response.status(HttpResponse.Ok).json({ ok: true });
      })
      .catch((error) => {
        console.error(`[ERROR] ${error}`);
        response.status(HttpResponse.BadRequest).json(error);
      });
  }

  /**
   * Verifica el token
   *
   * @route /v1/user/verifytoken
   * @method post
   */
  public verifyTokenPassword(request: Request, response: Response) {
    // Obtiene el token
    let token: string = request.body.token;

    User.findByRecoveryPasswordToken(token)
      .then((user) => {
        if (user) {
          response.status(HttpResponse.Ok).json(user);
        } else {
          response.status(HttpResponse.NotFound).send("not-found");
        }
      })
      .catch((error) => {
        response.status(HttpResponse.NotFound).json(error);
      });
  }

  /**
   * Obtiene las conexiones de un usuario
   *
   * @route /v1/user/connections
   * @method post
   */
  public connections(request: Request, respose: Response) {
    let decodedId = request.body.decoded.id;

    Connection.getConnections(decodedId, 3)
      .then((connections) => {
        respose.status(HttpResponse.Ok).json(connections);
      })
      .catch((error) => {
        respose.status(HttpResponse.BadRequest).json(error);
      });
  }

  /**
   * Contacto
   *
   * @route /v1/user/contactus
   * @method post
   */

  public contactUs(request: Request, respose: Response) {
    // Obtiene el usuario
    let user = request.body;

    // Envía el correo de contacto
    Mailer.contactUs(user);

    // Envía la respuesta
    respose.status(HttpResponse.Ok).json(user);
  }

  /**
   * Elimina un usuario
   *
   * @route /v1/user/delete
   * @method post
   */

  public delete(request: Request, response: Response) {
    // ...
  }

  public getById(req: Request, res: Response) {
    User.findById(req.params.id)
      .then((data) => {
        res.status(HttpResponse.Ok).json(data);
      })
      .catch((err) => {
        res.status(HttpResponse.BadRequest).json(err);
      });
  }

  /**
   *
   * @route /v1/user/update
   * @method put
   */
  public updateOne(request: Request, response: Response) {
    let body = request.body;
    let id = body.decoded.id;
    User.findById(id)
      .then((user) => {
        if (body.change) {
          body.password = Crypto.hash(body.password);

          User.updateOne(id, body)
            .then((user) => {
              response.status(HttpResponse.Ok).json(user);
            })
            .catch((err) => {
              response.status(HttpResponse.BadRequest).json(err);
            });
        } else {
          delete body.password;
          User.updateOne(id, body)
            .then((user) => {
              response.status(HttpResponse.Ok).json(user);
            })
            .catch((err) => {
              response.status(HttpResponse.BadRequest).json(err);
            });
        }
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).json(err);
      });
  }

  /**
   * Obtiene todos los usuarios
   */
  public getUsers(request: Request, response: Response) {
    User.listUsers()
      .then((users) => {
        response.status(HttpResponse.Ok).json(users);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("Cannot find users");
      });
  }

  /**
   * Obtiene la informacion de un usuario a travez de su username
   * tambien retorna los post, seguidores, comentarios, likes, etc etc etc
   * @param request
   * @param response
   */

  public getUser(request: Request, response: Response) {
    User.findByUsername(request.params.username)
      .then(async (user) => {
        if (user) {
          let posts = await Post.getCountPostByUser(user._id);
          let friends = await Friend.followerAndFollowingsByUser(user._id);
          response.status(HttpResponse.Ok).json({
            user,
            friends,
            posts,
          });
        } else {
          response.status(HttpResponse.InternalError).send("user no exits");
        }
      })
      .catch((err) => {
        response.status(HttpResponse.InternalError).send("unknow error");
      });
  }

  /**
   *  Modifica las marcas SPONSORS
   *  Retorna las nuevas marcas SPONSORS
   * @param request
   * @param response
   */
  public updateSponsors(req: Request, res: Response) {
    User.upadateSponsors(req.body.id, req.body.sponsors)
      .then(async (sponsors: any) => {
        res.status(200).send(sponsors);
      })
      .catch((err) => {
        res.status(HttpResponse.InternalError).send("unknow error");
      });
  }

  /**
   * Obtiene los usuarios mas populares en sportyeah, que el usuario que hace la peticion no esta siguiendo, para que los pueda seguir
   * @param request
   * @param response
   */

   public async mostPopulateUsersToAdd(request: Request, response: Response) {
    // buscamos los 5 usuarios mas populares
    let users = await userHelper.fivePopulateUsers(request.body.decoded.id);
    // respondemos con los 5 usuarios
    response.status(HttpResponse.Ok).json(users);
  }
}

