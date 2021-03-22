import { Request, Response } from 'express';
import { HttpResponse } from '../helpers/httpResponse';
import { OpenGraph } from '../helpers/openGraph';
import Wish from '../models/wish';
import WishList from '../models/wishlist';
import { BaseController } from './baseController';

/**
 * WishController
 * 
 * Explica el objeto de este controlador
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */
 
export class WishController extends BaseController
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
     * Obtiene la lista de deseos, de un usuario
     */


    getListByUser(request:Request,response:Response){
        let id = request.params.id
        WishList.getListByUser(id)
            .then((list)=>{
                if(list == null){
                    WishList.createOne(id,null)
                        .then((list)=>{
                            response.status(HttpResponse.Ok).json(list)
                        })
                        .catch(()=>{
                            response.status(HttpResponse.InternalError).send('cannot get list')

                        })
                }else{
                    response.status(HttpResponse.Ok).json(list)
                    
                }
            })
            .catch(()=>{
                response.status(HttpResponse.InternalError).send('cannot get list')
                
            })
    }

    /**
     * Crear un deseo
     */
    public create(request:Request,response:Response){
        let wish = request.body
        let user = request.body.decoded.id
        wish.user = user
        delete wish.decoded
        Wish.createWish(wish)
            .then((wish)=>{
                response.status(HttpResponse.Ok).json(wish)
            })
            .catch((err)=>{
                
                
                response.status(HttpResponse.BadRequest).send('cannot create wish')
            })
        
    }


    /**
     * obtiene los deseos de una lista de deseos
     */
    public getWishesByList(request:Request,response:Response){
        let list = request.params.id
        Wish.getWishByList(list)
            .then((wishes)=>{
                response.status(HttpResponse.Ok).json(wishes)
            })
            .catch((err)=>{
                response.status(HttpResponse.BadRequest).send('cannot get wishes')
            })
        
    }

    /**
     * Cambia la privacidad de un deseo
     * de public a private y viceversa
     * @param request 
     * @param response 
     */
    public privacity(request:Request, response:Response){
        let id = request.params.id
        Wish.getById(id)
            .then((wish)=>{
                let option = 'public';

                if(wish.privacity == 'public'){
                    option = 'private'
                }
                
                Wish.changePrivacity(id,option)
                    .then((wish)=>{
                        response.status(HttpResponse.Ok).json({change:option})
                        
                    })
                    .catch((err)=>{
                        
                        response.status(HttpResponse.BadRequest).send('cannot change privacity')
     
                    })
            })
            .catch((err)=>{
                
                response.status(HttpResponse.BadRequest).send('cannot find wish')
            })
    }   


    /**
     * Borra o elimina un deseo
     * @param request 
     * @param response 
     */
    public delete(  request:Request,  response:Response){
        let id = request.params.id 
        Wish.deleteById(id)
            .then((wish)=>{
                response.status(HttpResponse.Ok).json({delete:true})
            })
            .catch((err)=>{
                response.status(HttpResponse.BadRequest).send('cannot delete wish')
            })
    }

    /**
     * Marca un deseo como cumplido, y si esta cumplido, lo marca como pendiente
     */
    public dondeUndone(request:Request, response:Response){
        let id = request.params.id
        Wish.getById(id)
            .then((wish)=>{
                let bool = !wish.done 
                Wish.doneUndone(id,bool)
                    .then((wish)=>{
                        response.status(HttpResponse.Ok).json({done:bool})
                    })
                    .catch((err)=>{
                        response.status(HttpResponse.BadRequest).send('cannot change done')
                    })
            })
            .catch((err)=>{
                response.status(HttpResponse.BadRequest).send('cannot get wish')
            })
    }

    /**
     * Edita un deseo 
     */

    public edit(request:Request, response:Response){
        let id = request.params.id
        let newValues = request.body
        delete newValues.decoded
        Wish.editOne(id,newValues)
            .then((wish)=>{
                response.status(HttpResponse.Ok).json(wish)
            })
            .catch((err)=>{
                response.status(HttpResponse.BadRequest).send('cannot edit wish')

            })
        
    }


    /**
     * Obtiene informacion de una pagina a traves de un link que se le pasa, con open Graph
     */
    
    public async openGraph(request:Request, response:Response){
        let url = request.body.url 
        OpenGraph.pageInfo(url)
            .then((data)=>{
                response.status(HttpResponse.Ok).json(data)

            })
            .catch((err)=>{
                response.status(HttpResponse.Unauthorized).send('cannot read info')

            })
        
        
        
    }
}