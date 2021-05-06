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

import { Config } from "./config";

export class Mail
{
    /**
     * El agente de transporte de correo
     */
    private static transporter:any = null;

    /**
     * El constructor es privado
     * El objeto es un singleton
     */
    private constructor()
    {
        // Constructor Privado
    }

    /**
     * Inicia el agente de transporte
     * 
     * @return {void}
     */
    public static init():void
    {
        if (!Mail.transporter) {
            
            // Importe nodemailer para el envío de correo
            const nodemailer = require('nodemailer');

            // Configura el agente de transporte
            Mail.transporter = nodemailer.createTransport(
                {
                    host                : Config.get('mail.smtp.host'),
                    port                : Config.get('mail.smtp.port'),
                    secure              : Config.get('mail.smtp.secure'),
                    tls                 : 
                        {
                            rejectUnauthorized: false
                        },
                    auth                : 
                        {
                            user: Config.get('mail.smtp.user'),
                            pass: Config.get('mail.smtp.password')
                        },
                }
            );

            
            

            // Importa el plugin para usar plantillas hbs
            const hbs = require('nodemailer-express-handlebars');

            // La carpeta que contiene las vistas
            const viewsFolder:string = require('path').resolve(`${__dirname}/../views/mail`);

            Mail.transporter.use('compile', hbs({
                viewEngine : {
                    extname: '.hbs', // handlebars extension
                    layoutsDir:viewsFolder, // location of handlebars templates
                    defaultLayout:false, // Aqui le pasamos el template o email que enviaremos
                    partialsDir: viewsFolder, // location of your subtemplates aka. header, footer etc
            
                },
                viewPath: viewsFolder,
                extName: '.hbs',
            }));
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
    public static async send(mail:any)
    {
        // Inicia el agente de transporte de correo SMTP
        Mail.init();

        // Añade el remitente del mensaje
        mail.from = Config.get('mail.smtp.user');

        let sender = await Mail.transporter.sendMail(mail);

        return sender.messageId;
    }
}
