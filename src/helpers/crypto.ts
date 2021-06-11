/**
 * Clase Crypto
 * 
 * Fachada con funciones de encriptación
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 *
 * @link https://www.npmjs.com/package/bcrypt
 */

import{ hashSync, compareSync } from 'bcryptjs';

export class Crypto
{
    /**
     * El constructor es privado
     */
    private constructor()
    {
        // Constructor Privado
    }

    /**
     * Codifica un texto
     * 
     * @param {string} text     El texo a codificar
     * 
     * @return {string}         El texto codificado (obtiene el hash del texto)
     */
    public static hash(text:string):string
    {
        return hashSync(text);
    }

    /**
     * Devuelve true si la contraseña en texto plano suministrada
     * coincide con el hash
     * 
     * @param {string} password 
     * @param {string} hash
     * 
     * @return {boolean} 
     */
    public static compare(password:string, hash:string):boolean
    {
        return compareSync(password, hash); 
    }
}