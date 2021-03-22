import { ExampleController } from '../controllers/_exampleController';

/**
 * exampleRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */

/**
 * Carga el controlador
 */
const exampleController = new ExampleController();

/**
 * Habilita el Router
 */
const ExampleRouter:any = exampleController.router();

/**
 * index
 * 
 * Ruta por defecto
 * 
 * @route /example/
 * @method get
 */
ExampleRouter.get('/', exampleController.index);

module.exports = ExampleRouter;
