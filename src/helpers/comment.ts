/**
 * Clase CommentFilter
 *
 * Se usa para filtrar los comenterios, publicaciones, likes
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 *
 */

 import Answer from "../models/answer";
 import Post from "../models/post";
 import Comment from "../models/comment";
 import QuestionGroup from "../models/questionGroup";
 import User from "../models/user";
 export class CommentFilter {
   private constructor() {
     // Constructor Privado
   }
 
   /**
    * Retorna la data de un Question
    * @param question la question en si
    * @returns
    */
    /* public static async filterComments(comments:any){
    comments.foreach(async comment => {
        let question =
        comment.question != null
        ? await this.getDataQuestion(comment.question)
        : null;  
        comment.questionGroup = question 
        console.log(comment.questionGroup)  
    });
    console.log("============================================================================")
    // console.log(comments)
    return comments
   } */
 
 
 
 
   public static async findIpView(id,ip){
 
     await Post.findViewIp(id,ip).then((resp)=>{
 
       
      if(!resp){
       Post.newView(id,ip).then((response)=>
       console.log('ok')
       )
      }
        
       return resp
     })
     .catch((err)=>{
       console.log(err)
     })
   }
 }
 