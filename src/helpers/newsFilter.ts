/**
 * Clase postFilter
 *
 * Se usa para filtrar los comenterios, publicaciones, likes
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 *
 */
 import QuestionGroup from "../models/questionGroup";
 import Answer from "../models/answer";
 import News from "../models/news";
 export class NewsFilter {
   private constructor() {
     // Constructor Privado
   }
 
 

 /**
   * Retorna la data de un Question
   * @param question la question en si
   * @returns
   */
  public static async getDataQuestion(question): Promise<any> {
    // retornamos una promesa
    return new Promise(async (resolve) => {
      // buscamos los grupos de esa cuestion
      let questionGroup = await QuestionGroup.findByQuestion(question._id);

      // creamos un array donde iran los grupos y sus respectivas answers

      let questionGroupAndAnswers = [];
      // iterador de control
      let j = 0;
      // si hay grupos entonces buscamos los answers
      if (questionGroup.length >= 1) {
        // recorremos los grupos
        questionGroup.forEach(async (questionGroup, i, arr) => {
            let questionHeadline = questionGroup.questionHeadline

          // buscamos los answers de cada grupo
          let answersOld:any = await Answer.findByQuestionGroup(questionGroup._id);
          // total de usuarios que han votado
          let total = 0;
          // no necesitamos a los usuarios, solo la cantidad asi que en un map retornamos solo el length de los users
          let answer = answersOld.map((answer) => {
            let { users, _id, questionGroup, option,position } = answer;
            let newAnswer = {
              users: users.length,
              _id: _id,
              questionGroup: questionGroup,
              option: option,
              position: position
            };
            total = total + users.length;
            return newAnswer;
          });
          // si el total es 0 entonces retornamos un 1 para que no de error, si no retornamos la cantidad que es
          total = total == 0 ? 1 : total;
          // metemos en el array, el grupo, las answers y el total
          questionGroupAndAnswers.push({ questionHeadline,questionGroup, answer, total });
          j += 1;
          //organiza para que se mantenga el orden de las preguntas
          questionGroupAndAnswers.sort((a,b)=>{
            return b.position - a.position
          })  
          if (j == arr.length) {
            // respondemos con toda la data

            resolve(questionGroupAndAnswers);
          }
        });
      } else {
        resolve(questionGroupAndAnswers);
      }
    });
  }


   public static async findIpView(id,ip){
 
     await News.findViewIp(id,ip).then((resp)=>{
      if(!resp){
       News.newView(id,ip).then((response)=>
       console.log('creamos una view',response)
       )
      }
        
       return resp
     })
     .catch((err)=>{
       console.log(err)
     })
   }
 }
 