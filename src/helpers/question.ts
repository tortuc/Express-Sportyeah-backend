/**
 * Clase questionHelper
 * 
 * Se usa para filtrar los comenterios, publicaciones, likes 
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 * 
 */
 import QuestionGroup from '../models/questionGroup'
 import Answer from '../models/answer'


export class QuestionHelper
{
    private constructor()
    {
        // Constructor Privado
    }


    public static filterQuestion(questionGroup:any[],questionId){
      console.log('recibiendo el grupo',questionGroup);
      
    questionGroup.forEach(question => {
      QuestionGroup.create(questionId,question.questionHeadline)
      .then((response:any)=>{
        question.answer.forEach(answer => {
          Answer.create(response._id,answer.option)
          .then((answer)=>{
            console.log(answer,'answer creadp');
            
          })
          .catch((e)=>{
            console.log('err',e);
            
          })
        });
        
      })
      .catch((err)=>{
        // hendler error
      })
    });
      
    
      

      
      
      
    }
}