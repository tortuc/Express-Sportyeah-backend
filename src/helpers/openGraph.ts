/**
 * Clase OpenGraph
 * 
 * Fachada con funciones de 
 * Obtención de informacion de paginas web con Open Graph
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 *
 * @link https://www.npmjs.com/package/open-graph
 */



export class OpenGraph
{
    private static og = require('open-graph');
    /**
     * El constructor es privado
     */
    private constructor()
    {
        // Constructor Privado
    }

    /**
     * Obtiene la informacion de una pagina web
     * @param {string} url url de la pagina
     * @return {any}     objeto con informacion
     */
    public static async pageInfo(url:string):Promise<any>
    {
        return await new Promise((resolve,reject)=>{
            this.og(url, function(err, meta){
                if(!err){
                    
                    resolve(meta)
                }else{
                    reject(err)
                }
            })
        })
         
    }

  
}
