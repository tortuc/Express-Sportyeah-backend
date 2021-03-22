import { BaseController } from './baseController';
import { Config } from '../helpers/config';

/**
 * HttpErrorController
 * 
 * Controlador para errores HTTP
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */
 
export class HttpErrorController extends BaseController
{
    /**
     * El constructor
     */
    public constructor()
    {
        // Llamamos al constructor padre
        super();
    }

    /**
     * Muestra el error HTTP
     * 
     * @param {any} request     La solicitud HTTP
     * @param {any} response    La respuesta HTTP
     */
    public index (request:any, response:any)
    {
        // El código del error HTTP
        let code:number = request.params.code;

        // Fija el código de respuesta de la página
        response.status(code);

        // Carga la vista /views/error/error
        response.render('error/error', {
            title   : `Error ${code}`,
            code    : code,
            app     : 
                {
                    name    : Config.get('app.name'),
                    version : Config.get('app.version'),
                    url     : Config.get('app.url'),
                }
        });
    };
}