/**
 * Clase postFilter
 * 
 * Se usa para filtrar los comenterios, publicaciones, likes 
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 * 
 */


export class PostFilter
{
    private constructor()
    {
        // Constructor Privado
    }


    public static filterQuestionsAnswered(post:any,idUser){
      let i = 0
      post.question.questionGroup.forEach(element => {
        
       element.users.forEach(element2 => {
        
         if(idUser == element2.id){
          post.question.questionGroup[i].voted = true
          console.log("si es voted")
         }
       });
       console.log(element)
       i ++
      });
      // console.log(post.question.questionGroup)
      return true
    }
}