/**
 * Clase Config
 * 
 * Mantiene la configuración de la aplicación
 * Es un singleton
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

 import * as path from 'path'

export class Config
{
    
    /**
     * Instancia única de la clase 
     */
    private static instance = null;

    /**
     * Contiene la configuración
     */
    protected config:any;

    /**
     * El constructor es privado
     */
    private constructor()
    {
        Config.instance = this;

        this.readConfig();
    }
 
    /**
     * Lee el archivo de configuración
     * 
     * @return {void}
     */
    protected readConfig():void
    {
        // Carga el archivo de configuración principal de la aplicación app.config
        let ini = require('ini');
        let fs  = require('fs');

        // Carga la configuración global de la aplicación
        // app.config
        this.config = ini.parse(fs.readFileSync(path.resolve(__dirname +'/../app.config'), 'utf-8'));
    }

    /**
     * Obtiene un valor de configuración
     * 
     * @param {string}   La clave de la configuración a obtener
     *                   Ej: servername
     * 
     * @return {string}  El valor cd configuración que corresponde a esa clave
     *                   Ej: www.ḱudiska.com
     * 
     * @throws Error     Si la clave no se encuentra en el archivo de configuración 
     * 
     * @example
     * 
     * let appName:string = Config.get('app.name')
     * 
     * Lee el archivo app.config y devuelve el nombre de la aplicación: "sportyeah".
     * 
     * En el archivo app.config aparece:
     * 
     * [app]
     * 
     * name=sportyeah
     */
    public static get(value:string):string
    {
        let configuration:any;

        if (Config.instance == null) {
            configuration = new Config();
        } else {
            configuration = Config.instance;
        }

        const access = require('safe-access');

        let result:string = access(configuration.config, value);

        if (typeof result === 'undefined') {
            // El momento actual
            let moment:string = new Date().toLocaleTimeString();
            
            throw `[ERROR] ${moment} Clave ${value} no encontrada en el archivo de configuración app.config. Defina un valor de configuración para esa clave ${value}`;
        }

        return result;
    }
}