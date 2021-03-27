import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, Response } from 'express';
import Question from '../models/question'
/**
 * QuestionController
 * 
 * Explica el objeto de este controlador
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */
 
export class QuestionController extends BaseController
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
     * crea un pregunta
     * 
     * @route /question/create
     * @method get
     */
    public create(request:Request, response:Response)
    {
        Question.create(request.body)
      .then((resp) => {
        response.status(HttpResponse.Ok).json(resp);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).json(err);
      });
    }

     /**
   * Encontrar Pregunta
   *
   * @route /v1/question
   * @method question
   */
  public findQuestion(request: Request, response: Response) {
    Question.findOneQuestion(request.params.id)    
      .then((resp) => {
        response.status(HttpResponse.Ok).json(resp);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot-find-Question");
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

}
