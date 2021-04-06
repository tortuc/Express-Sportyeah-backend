import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, response, Response } from "express";
import Question from "../models/question";
import QuestionGroup from "../models/questionGroup";
import Answer from "../models/answer";
import { QuestionHelper } from "../helpers/question";
/**
 * QuestionController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */

export class QuestionController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * crea un pregunta
   *
   * @route /question/create
   * @method get
   */
  public create(request: Request, response: Response) {

    Question.create(request.body.user,request.body.finishVotes)
      .then((resp:any) => {
        QuestionHelper.filterQuestion(request.body.questionGroup, resp._id);

        response.status(HttpResponse.Ok).json(resp);
      })
      .catch((err) => {

        response.status(HttpResponse.BadRequest).json(err);
      });
  }

  
  /**
   * Encontrar Preguntas por post
   *
   * @route /v1/question
   * @method question
   */
  /*   public findByPost(request: Request, response: Response) {
        Question.findByPost(request.params.id)    
          .then((resp) => {
            response.status(HttpResponse.Ok).json(resp);
          })
          .catch((err) => {
            response.status(HttpResponse.BadRequest).send("cannot-find-Question");
          });
      } */

  /**
   * Encontrar Preguntas por noticia
   *
   * @route /v1/question
   * @method question
   */
  /* public findByNews(request: Request, response: Response) {
        Question.findByNews(request.params.id)    
          .then((resp) => {
            response.status(HttpResponse.Ok).json(resp);
          })
          .catch((err) => {
            response.status(HttpResponse.BadRequest).send("cannot-find-Question");
          });
      }
 */

  /**
   * Editar Questions
   *
   * @route /v1/question/edit
   * @method question
   */
  public updateQuestion(request: Request, response: Response) {
    request.body.edited = Date.now();
    Question.updateQuestion(request.params.id, request.body)
      .then((resp) => {
        response.status(HttpResponse.Ok).json(resp);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).json(err);
      });
  }

  /**
   * Eliminar una pregunta
   *
   * @route /v1/question/delete
   * @method question
   */
  public deleteOneById(request: Request, response: Response) {
    Question.deleteOneById(request.params.id)
      .then((resp) => {
        response.status(HttpResponse.Ok).json(resp);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).json(err);
      });
  }


  /**
   * Agregar un usuario a un answer (voto)
   */

  public voteAnwers(request:Request,response:Response){
    let {id, user} = request.params;
    Answer.newUser(id, user).then((resp)=>{
      response.status(200).json(resp)
    })
    .catch((e)=>{
      console.log(e);
      
    })
  }


  /**
   * Busca que usuario ya haya votado
   */

   public userVoted(request:Request,response:Response){
    let {id, user} = request.params;
    Answer.userVoted(id, user).then((resp)=>{
      response.status(200).json(resp)
    })
    .catch((e)=>{
      console.log(e);
      
    })
  }
}
