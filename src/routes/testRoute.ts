import { TestController } from "../controllers/testController";

/**
 * testRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const testController = new TestController();

/**
 * Habilita el Router
 */
const TestRouter:any = testController.router();

/**
 * Tests
 * 
 * Muestra todos los tests
 * 
 * @route /v1/tests
 * @method get
 */
TestRouter.get('/', testController.all);

/**
 * Test
 * 
 * Muestra el resultado de un test
 * 
 * @route /v1/tests/test/:name
 * @method get
 */
TestRouter.get('/test/:name', testController.get);

/**
 * New
 * 
 * Crea un nuevo test
 * 
 * @route /v1/tests/new
 * @method post
 */
TestRouter.post('/new', testController.new);

TestRouter.get("/admineamil/:username",testController.emailAdmin)
TestRouter.get("/translate/:text/:lang",testController.transalte)

module.exports = TestRouter;
