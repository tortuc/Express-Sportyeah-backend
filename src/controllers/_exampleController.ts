import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, Response } from 'express';

/**
 * ExampleController
 * 
 * Explica el objeto de este controlador
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */
 
export class ExampleController extends BaseController
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
     * Ruta por defecto
     * 
     * @route /example/
     * @method get
     */
    public index(request:Request, response:Response)
    {
        // Envía una respuesta
        response.status(HttpResponse.Ok).send(`[OK] Mensaje de bienvenida enviado con éxito`);
    }
}
