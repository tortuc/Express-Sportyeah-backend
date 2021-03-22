/**
 * Clase Admin
 * 
 * Crea un usuario Super Administrador
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 * 
 */

import { error } from 'console';
import * as socketIO from 'socket.io'
import User from '../models/user'
import { Crypto } from './crypto';
export class Admin
{
    /**
     * El constructor
     */
    private constructor()
    {
        // Constructor Privado
    }



    public static createAdmin(){
        
        User.create( new User({
            name:'Administrador',
            last_name:'sportyeah',
            role:'admin',
            email:'admin@sportyeah.com',
            password:Crypto.hash('sportyeahadmin2020'),
            verified:true
        }))
        .then((user)=>{
            // se creo el admin
        })
        .catch((err)=>{
            // ya el admin existe
        })
    
        
    }

    

    
    

}
