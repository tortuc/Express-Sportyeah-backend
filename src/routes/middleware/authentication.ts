import * as JWT from 'jsonwebtoken';
import { Config } from '../../helpers/config';

/**
 * Authentication
 * 
 * Middlware de autenticación
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */
export class Authentication
{
    /**
     * El constructor
     */
    private constructor()
    {
        // Constructor privado
    }

    /**
     * Middleware para la autenticación por JWT
     * 
     * @param {any} request 
     * @param {any} response 
     * @param {any} next 
     * 
     * @return {void}
     * 
     * @link https://medium.com/@asfo/autenticando-un-api-rest-con-nodejs-y-jwt-json-web-tokens-5f3674aba50e
     *
     */
    public static jwt(request:any, response:any, next:any):void
    {
        // Obtiene el token del encabezado de la petición HTTP "access-token"
        const token: string = <string>request.headers['access-token'];
    
        if (token) {
            // Si se ha suministrado un token
            JWT.verify(token, Config.get('jwt.key'), (error: any, decoded: any) => {
                if (error) {
                    response.status(403);
                    return response.json({ 
                        message: 'Invalid token' 
                    });
                } else {
                
                    request.body.decoded = decoded;
                    next();
                }
            });
        } else {
            // Si falta el token
            response.status(403);
            response.send({
                message: 'Missing Token'
            });
        }
    };

    /**
     * Obtiene el token JWT
     * 
     * @param {User} user   Un usuario
     * 
     * @return {string}     El token JWT
     */
    public static token(user:any):string
    {
        return JWT.sign({
            id: user._id,
            name: user.name,
            role: user.role
        },
            Config.get('jwt.key')
        );
    }
}
