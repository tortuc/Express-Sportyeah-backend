import { QuestionController } from '../controllers/questionController';
import { Authentication } from './middleware/authentication';

/**
 * questionleRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */

/**
 * Carga el controlador
 */
const questionController = new QuestionController();

/**
 * Habilita el Router
 */
const QuestionRouter:any = questionController.router();


/**
 * Obtiene una pregunta
 * 
 * 
 * @route /v1/question/create
 * @method post
 */
 QuestionRouter.get('/:id', questionController.findOneQuestion);



/**
 * Crear una pregunta
 * 
 * 
 * @route /v1/question/create
 * @method post
 */
QuestionRouter.post('/create', questionController.create);



/**
 * Obtiene una pregunta por id
 * 
 * 
 * @route /v1/question/:id
 * @method get
 */
// QuestionRouter.get('/:id', questionController.findQuestion);

/**
 * Obtiene las preguntas por post
 * 
 * 
 * @route /v1/question/sport/:id
 * @method get
 */
// QuestionRouter.get('/post/:id', questionController.findByPost);

/**
 * Obtiene las preguntas por post
 * 
 * 
 * @route /v1/question/news/:id
 * @method get
 */
// QuestionRouter.get('/news/:id', questionController.findByNews);

/**
 * Obtiene las preguntas de un usuario por id
 * 
 * 
 * @route /v1/question/update/:id
 * @method put
 */
QuestionRouter.put('/update/:id', questionController.updateQuestion);

/**
 * Obtiene las preguntas de un usuario por id
 * 
 * 
 * @route /v1/question/delete/:id
 * @method delete
 */
QuestionRouter.delete('/delete/:id', questionController.deleteOneById);

/**
 * Vote for answer
 * 
 * 
 * @route /v1/question/answer/:id/:user
 * @method get
 */
QuestionRouter.get('/answer/:id/:user', questionController.voteAnwers);

/**
 * User check voted
 * 
 * 
 * @route /v1/question/answer/:id/:user
 * @method get
 */
 QuestionRouter.get('/answer/voted/:id/:user', questionController.userVoted);


module.exports = QuestionRouter;
