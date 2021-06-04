/**
 * Clase Web
 * 
 * Contiene métodos útiles
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 * 
 */

import { Config } from "./config";
import { Environment } from "./environment";
export class Web
{
    /**
     * El constructor
     */
    private constructor()
    {
        // Constructor Privado
    }

    /**
     * Obtiene la url del frontend
     * 
     * @return {string}     La url del frontend
     */
    public static getUrl():string
    {
        return Environment.get() == Environment.Development ? 
            Config.get('frontend.development.url') : Config.get('frontend.production.url');
    }
    /**
     * Obtiene la url del api de archivos
     * 
     * @return {string}     La url del frontend
     */
    public static getUrlFileApi():string
    {
        return Environment.get() == Environment.Development ? 
            Config.get('fileapi.development.url') : Config.get('fileapi.production.url');
    }

    /**
     * Obtiene el token para la validación de un usuario
     *
     * Cuando el usuario se registra se le envía este código para verificar su cuenta
     * y terminar el registro
     * 
     * @return {string}     Un token
     */
    public static getToken():string
    {
        return 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);      
            return v.toString(16);
        });
    }

     /**
     * Obtiene la url del admin
     * 
     * @return {string}     La url del administrador
     */
      public static getUrlAdmin():string
      {
          return Environment.get() == Environment.Development ? 
              Config.get('frontend.development.url_admin') : Config.get('frontend.production.url_admin');
      }
}
