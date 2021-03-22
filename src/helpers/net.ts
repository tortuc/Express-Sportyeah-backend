/**
 * Clase Net
 * 
 * Fachada con funciones de 
 * Obtención de direcciones ip
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 *
 * @link https://www.npmjs.com/package/bcrypt
 */

export class Net
{
    /**
     * El constructor es privado
     */
    private constructor()
    {
        // Constructor Privado
    }

    /**
     * Obtiene la dirección ip de la conexión actual
     * @param {Request} request
     * @return {string}     La dirección ip
     */
    public static ip(request:any):string
    {
        let ip:string =  
            (
                (request.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
                request.connection.remoteAddress || 
                request.socket.remoteAddress || 
                request.connection.socket.remoteAddress
            );

        if (ip.substr(0, 7) == "::ffff:") {
            ip = ip.substr(7);
        }

        return ip;
    }

    /**
     * Obtiene los datos de localización de la dirección ip de la conexión actual
     * 
     * @param {string} ip   La dirección ip
     *
     * @return {any}        Los datos de geolocalización de la ip
     */
    public static geoIp(ip:string):any
    {   
        // Obtiene la geolocalización de la ip
        let geo = require('geoip-lite').lookup(ip);
        
        return {
            ip          : ip,
            city        : geo ? geo.city    : null,
            country     : geo ? geo.country : null,
            user        : null
        };
    }
}
