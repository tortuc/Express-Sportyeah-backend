import * as express from 'express';

/**
 * BaseController
 * 
 * Controlador Base, todos los controladores heredan de él
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */
 
export class BaseController
{
    /**
     * La aplicación express
     */
    protected app:any;

    /**
     * El constructor
     */
    public constructor()
    {
        this.app = express();
    }
    
    /**
     * Obtiene el enrutador de la aplicación
     * 
     * @returns {express.Express}
     */
    public router():express.Express
    {
        return this.app;
    }
}