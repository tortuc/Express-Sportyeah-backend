/**
 * Clase questionHelper
 * 
 * Se usa para filtrar los comenterios, publicaciones, likes 
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 * 
 */
 import QuestionGroup from '../models/questionGroup'
 import Answer from '../models/answer'
 import News from '../models/news'
 import Post from '../models/post'
 import Question from '../models/question'
 import Comment from '../models/comment'
 import { Alert } from '../helpers/alert'
export class QuestionHelper
{
    private constructor()
    {
        // Constructor Privado
    }


    public static filterQuestion(questionGroup:any,questionId){
      
      QuestionGroup.create(questionId,questionGroup.questionHeadline)
        .then((response:any)=>{
          questionGroup.answer.forEach(answer => {
            Answer.create(response._id,answer.option,answer.position)
            .then((answer)=>{
            })
            .catch((e)=>{
              console.log('err',e);
            })
          });
          
        })
        .catch((err)=>{
          // hendler error
        })
    }


    public static Init() {
      // Busca todas los questions que esten en votacion y su tiempo limite haya expirado
      setInterval(() => {
        

        Question.find({finishVotes: { $lt: new Date() }, notified:false }).then(
          (questions) => {
            if (questions.length > 0) {
              questions.forEach(async(question:any) => {
                //Colocamos que ya fue notificado
                Question.notifiedTrue(question._id).then(()=>console.log("bien"))

                // Buscamos el question si pertenece a una noticia o a una publicacion
                let id //el id del post o de la noticia
                let type // si es noticia o post
                let user // el usuario que hizo el post o noticia
               await News.find({question:question._id})
                .then((news:any)=>{
                  id = news[0]._id;
                  type = 'news'
                  user = news[0].user
                })
                .catch((err)=>{
                  
                })
                if(id == undefined){
                  await  Post.find({question:question._id})
                  .then((post:any)=>{
                    id = post[0]._id;
                    type = 'post'
                    user = post[0].user
                  })
                  .catch((err)=>{
                    
                  })
                }
                if(type == undefined){
                  await Comment.find({question:question._id})
                  .then((comment:any)=>{
                    id = comment[0]._id;
                    type = 'comment'
                    user = comment[0].user
                  })
                  .catch((err)=>{
                    
                  })
                }
                //Ahora enviamos la notificacion, con el id del post o noticia
                Alert.questionVotedEndNotification(question,id,type,user)
              });
            } else {
              // console.log("No hay resultados disponibles");
            }
          }
        );
      }, 1000 * 60 * 60);
    }


}