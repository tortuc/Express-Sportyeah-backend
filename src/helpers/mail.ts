/**
 * Clase Mail
 *
 * Envía un mensaje de correo
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 *
 * Usa nodemailer para el envío de correo
 * @link https://nodemailer.com
 *
 * Usa el plugin de nodemailer para el uso de plantillas hbs en la composición de mensajes
 * @link https://www.npmjs.com/package/nodemailer-express-handlebars
 */
const checkDiskSpace = require("check-disk-space");
import axios from "axios";
import AnalyticStore from "../models/analyticsStores";
import News from "../models/news";
import Post from "../models/post";
import { Analytic } from "./analytic";
import { Config } from "./config";
import { Translate } from "./translate";
import { Web } from "./web";
const os = require("os");

export class Mail {
  /**
   * El agente de transporte de correo
   */
  private static transporter: any = null;

  /**
   * El constructor es privado
   * El objeto es un singleton
   */
  private constructor() {
    // Constructor Privado
  }

  /**
   * Inicia el agente de transporte
   *
   * @return {void}
   */
  public static init(): void {
    if (!Mail.transporter) {
      // Importe nodemailer para el envío de correo
      const nodemailer = require("nodemailer");

      // Configura el agente de transporte
      Mail.transporter = nodemailer.createTransport({
        host: Config.get("mail.smtp.host"),
        port: Config.get("mail.smtp.port"),
        secure: Config.get("mail.smtp.secure"),
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: Config.get("mail.smtp.user"),
          pass: Config.get("mail.smtp.password"),
        },
      });

      // Importa el plugin para usar plantillas hbs
      const hbs = require("nodemailer-express-handlebars");

      // La carpeta que contiene las vistas
      const viewsFolder: string = require("path").resolve(
        `${__dirname}/../views/mail`
      );

      Mail.transporter.use(
        "compile",
        hbs({
          viewEngine: {
            extname: ".hbs", // handlebars extension
            layoutsDir: viewsFolder, // location of handlebars templates
            defaultLayout: false, // Aqui le pasamos el template o email que enviaremos
            partialsDir: viewsFolder, // location of your subtemplates aka. header, footer etc
          },
          viewPath: viewsFolder,
          extName: ".hbs",
        })
      );
    }
  }

  /**
   * Envía un mensaje de correo
   *
   * @param {object}    Un mensaje de correo
   *
   * @return {string}   El id del mesaje de correo enviado
   *
   * @example
   *
   * Envío de un mensaje:
   *
   * Mail.send(
   *       {
   *           to          : 'jogeiker1999@gmail.com', // Detinatario/s del mensaje
   *           subject     : 'test',            // El asunto
   *           message     : 'test'             // El mensaje
   *       }
   * ).then(result => {
   *
   * }).catch(error => {
   *      console.error('Se ha producido un error al intentar enviar el correo');
   * });
   *
   * Envío de un mensaje utilizando una plantilla ubicada en /views/mail/:
   *
   * Mail.send(
   *       {
   *           to          : 'jogeiker1999@gmail.com', // Detinatario/s del mensaje
   *           subject     : 'test',            // El asunto
   *           template    : 'welcome'          // La plantilla /views/mail/welcome.html
   *           context     :
   *              {
   *                  name        : name,
   *                  lastname    : lastname,
   *                  email       : email
   *              }
   *       }
   * ).then(result => {
   *
   * }).catch(error => {
   *      console.error('Se ha producido un error al intentar enviar el correo');
   * });
   */
  public static async send(mail: any) {
    // Inicia el agente de transporte de correo SMTP
    Mail.init();

    // Añade el remitente del mensaje
    mail.from = Config.get("mail.smtp.user");

    let sender = await Mail.transporter.sendMail(mail);

    return sender.messageId;
  }

  public static async getContextNewUser(user: any, link: string, geo: any) {
    /**
     * Aqui obtenemos el texto que necesitamos, en el idioma que indiquemos
     */
    const { ip, country } = geo;
    const { name, last_name, email, username, browser } = user;
    let title = await Translate.get("email.new_user.title", "es");
    let sport = await Translate.get(`allSports.${user.sport}`, "es");
    let sportImage = `https://app.sportyeah.com/assets/sports/${user.sport}.png`;

    let profile = await Translate.get(
      `profile_user.${user.profile_user}`,
      "es"
    );

    const context = {
      name,
      last_name,
      email,
      username,
      link,
      title,
      sport,
      sportImage,
      profile,
      ip,
      country,
      browser,
      appInfo: null,
      map: null,
    };
    return context;
  }

  public static async appInfo() {
    let usersInfo = await Analytic.usersOnlines();

    let sizeinfo = await checkDiskSpace(os.homedir());
    let { free, size } = sizeinfo;
    let used = ((size - free) / 1000000 / 1000).toFixed();
    let stores = await AnalyticStore.getAllData();
    let news = await News.totalNewsToday();
    let posts = await Post.totalPostToday();

    const appInfo = {
      usersInfo,
      posts,
      used,
      news,
    };

    return appInfo;
  }
}
