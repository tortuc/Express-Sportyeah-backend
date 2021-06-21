import { Mail } from "../helpers/mail";
import { Config } from "../helpers/config";
import { Translate } from "../helpers/translate";

/**
 * MailController
 *
 * Envía mensajes de correo
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class MailController {
  /**
   * El constructor
   */
  private constructor() {
    // Es privado
  }

  /**
   * Correo que se envía para validar la cuenta
   *
   * @param {User} user               El usuario
   * @param {string} validationLink   El enlace para validar la cuenta
   *
   * @return {void}
   */
  public static verifyAccount(user: any, validationLink: string): void {
    // Envía el correo para la validación de la cuenta de usuario creada
    Mail.send({
      to: user.email,
      subject: `Verificar cuenta`,
      template: "verification",
      context: {
        name: user.name,
        last_name: user.last_name || "",
        link: validationLink,
      },
    })
      .then((result) => {
        console.info(
          `[OK] Mensaje ${result} enviado con éxito a ${user.email}`
        );
      })
      .catch((error) => {
        console.error(`[ERROR] ${error}`);
      });
  }

  public static verifyAccountParents(user: any, validationLink: string): void {
    // Envía el correo para la validación de la cuenta de usuario creada
    Mail.send({
      to: user.parents_email,
      subject: `Verificar cuenta`,
      template: "verification_parents",
      context: {
        name: user.parents_name,
        last_name: user.parents_last_name || "",
        name_young: user.name,
        last_name_young: user.last_name,
        link: validationLink,
      },
    })
      .then((result) => {
        console.info(
          `[OK] Mensaje ${result} enviado con éxito a ${user.parents_email}`
        );
      })
      .catch((error) => {
        console.error(`[ERROR] ${error}`);
      });
  }

  /**
   * Correo que se envía cuando se produce un intento de acceso no conocido
   *
   * @param {User}   user             El usuario
   * @param {any}    geo              Los datos de geolocalización
   * @param {string} link             El enlace
   *
   * @return {void}
   */
  public static async unknowAccess(
    user: any,
    geo: any,
    link: string
  ): Promise<void> {
    //Se genera el url para la imagen de la ubicacion
    const googleMapsApikey = Config.get("googleMaps.apiKey");
    const baseURl = Config.get("googleMaps.baseURL");
    const url = `${baseURl}center=${geo.latitud},${geo.longitud}&size=600x450&zoom=13&key=${googleMapsApikey}`;

    // Se Obtiene las traducciones para este email
    const title = await Translate.get("email.unknow_access.title", user.lang);
    const greetingBegin = await Translate.get(
      "email.unknow_access.greeting_begin",
      user.lang
    );
    const greetingEnd = await Translate.get(
      "email.unknow_access.greeting_end",
      user.lang
    );
    const messageBegin = await Translate.get(
      "email.unknow_access.message_begin",
      user.lang
    );
    const messageMiddle = await Translate.get(
      "email.unknow_access.message_middle",
      user.lang
    );
    const goTo = await Translate.get("email.unknow_access.go_to", user.lang);
    Mail.send({
      to: user.email,
      subject: title,
      template: "diferentIp",
      context: {
        name: user.name,
        last_name: user.last_name || "",
        link,
        ip: geo.ip,
        city: geo.city,
        country: geo.country,
        mapUrl: url,
        title,
        greetingBegin,
        greetingEnd,
        messageBegin,
        messageMiddle,
        goTo,
      },
    })
      .then((result) => {
        console.info(
          `[OK] Mensaje ${result} enviado con éxito a ${user.email}`
        );
      })
      .catch((error) => {
        console.error(`[ERROR] ${error}`);
      });
  }

  /**
   * Correo que se envía cuando se produce un intento de acceso fallido
   *
   * @param {User}   user             El usuario
   * @param {any}    geo              Los datos de geolocalización
   * @param {string} link             El enlace
   *
   * @return {void}
   */
  public static attempFailed(user: any, geo: any, link: string): void {
    Mail.send({
      to: user.email,
      subject: `Intento fallido`,
      template: "attempts",
      context: {
        name: user.name,
        last_name: user.last_name || "",
        link: link,
        ip: geo.ip || "",
        city: geo.city || "",
        country: geo.country || "",
      },
    })
      .then((result) => {
        console.info(
          `[OK] Mensaje ${result} enviado con éxito a ${user.email}`
        );
      })
      .catch((error) => {
        console.error(`[ERROR] ${error}`);
      });
  }

  /**
   * Correo que se envía cuando una nueva cuenta ha sido creada
   *
   * @param {User} user               El usuario
   * @param {string} validationLink   El enlace
   *
   * @return {void}
   */
  public static async newAccountCreated(
    user: any,
    link: string,
    geo: any
  ): Promise<void> {
    let context = await Mail.getContextNewUser(user, link, geo);
    const appInfo = await Mail.appInfo();
    context.appInfo = appInfo;
    const googleMapsApikey = Config.get("googleMaps.apiKey");
    const baseURl = Config.get("googleMaps.baseURL");

    const url = `${baseURl}center=${geo.latitud},${geo.longitud}&size=600x450&zoom=13&key=${googleMapsApikey}`;
    context.map = url;
    Mail.send({
      to: Config.get("app.admin"),
      subject: `Nuevo usuario`,
      template: "newUser",
      context,
    })
      .then((result) => {
        console.info(
          `[OK] Mensaje ${result} enviado con éxito a ${Config.get("app.admin")}`
        );
      })
      .catch((error) => {
        console.error(`[ERROR] ${error}`);
      });
  }

  /**
   * Correo que se envía para la recuperación de contraseña
   *
   * @param {User} user               El usuario
   * @param {string} validationLink   El enlace para validar la cuenta
   *
   * @return {void}
   */
  public static recoveryPassword(user: any, link: string): void {
    // Envía el correo de recuperación de contraseña
    Mail.send({
      to: user.email,
      subject: `Recuperar contraseña`,
      template: "forgotPassword",
      context: {
        name: user.name,
        last_name: user.last_name,
        link: link,
      },
    })
      .then((result) => {
        console.info(
          `[OK] Mensaje ${result} enviado con éxito a ${user.email}`
        );
      })
      .catch((error) => {
        console.error(`[ERROR] ${error}`);
      });
  }

  /**
   * Correo del formulario de contacto de la aplicación
   *
   * @param {User} user               El usuario
   *
   * @return {void}
   */
  public static contactUs(user: any): void {
    // Correo para el administrador del sitio
    Mail.send({
      to: Config.get("app.admin"),
      subject: `Atención al cliente`,
      template: "contactUsEs",
      context: user,
    })
      .then((result) => {
        console.info(
          `[OK] Mensaje ${result} enviado con éxito a ${Config.get(
            "app.admin"
          )}`
        );
      })
      .catch((error) => {
        console.error(`[ERROR] ${error}`);
      });

    // Correo para el usuario
    Mail.send({
      to: user.email,
      template: user.lang == "es" ? "replyUserEs" : "replyUserEn",
      subject: user.lang == "es" ? "Atención al cliente" : "Customer Support",
      context: user,
    })
      .then((result) => {
        console.info(
          `[OK] Mensaje ${result} enviado con éxito a ${user.email}`
        );
      })
      .catch((error) => {
        console.error(`[ERROR] ${error}`);
      });
  }

  /**
   * Correo que se envía cuando se crea un nuevo administrador
   *
   * @param {User}   user             El administrador
   *
   * @return {void}
   */
  public static newAdmin(
    user: any,
    password: number,
    link_app: string,
    link: string
  ): void {
    Mail.send({
      to: user.email,
      subject: "Sportyeah",
      template: "welcomeAdmin",
      context: {
        name: user.name,
        last_name: user.last_name || "",
        email: user.email,
        link,
        link_app,
        password,
      },
    })
      .then((result) => {
        console.info(
          `[OK] Mensaje ${result} enviado con éxito a ${user.email}`
        );
      })
      .catch((error) => {
        console.error(`[ERROR] ${error}`);
      });
  }
}
