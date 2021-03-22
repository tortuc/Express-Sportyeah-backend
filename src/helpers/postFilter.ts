/**
 * Clase postFilter
 * 
 * Se usa para filtrar los comenterios, publicaciones, likes 
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 * 
 */

export class Alert
{
    private constructor()
    {
        // Constructor Privado
    }


  public static  filtrarArrays(post){
    let likes = [];
    let comments = [];
    let shareds = [];
    
    likes = post.filter((post:any)=>{
    return (post.likes.length > 0)
   })
     
   comments = post.filter((post:any)=>{
    return (post.comments.length > 0)
   })
     
   shareds = post.filter((post:any)=>{
    return (post.shareds.length > 0)
   })

    //Ordena de mayor a menor el post con mas reacciones
    likes.sort(function(b, a) {
        return a.likes.length - b.likes.length ;
        });
      
        //Ordena de mayor a menor el post con mas comentarios
        comments.sort(function(b, a) {
        return a.comments.length - b.comments.length ;
        });
      
        //Ordena de mayor a menor el post con mas veces compartido
        shareds.sort(function(b, a) {
        return a.shareds.length - b.shareds.length ;
        });
}
}