import { UserController } from "../controllers/userController";

/**
 * Middleware de autenticación JWT requerido
 */
import { Authentication } from './middleware/authentication';

/**
 * UserRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const userController = new UserController();

/**
 * Habilita el Router
 */
const UserRouter:any = userController.router();

/**
 * user
 * 
 * @route /v1/user/user/:id
 * @method get
 */
UserRouter.get('/user/:id', userController.user);

/**
 * Elimina un usuario
 * 
 * @route /v1/user/delete/:id
 * @method post
 */
UserRouter.post('/delete/:id', userController.delete);

/**
 * crea un usuario
 * 
 * @route /v1/user/create
 * @method post
 */
UserRouter.post('/create', userController.create);

/**
 * crea un administrador
 * 
 * @route /v1/user/createadmin
 * @method post
 */
 UserRouter.post('/createadmin',Authentication.jwt, userController.createAdmin);

/**
 * Reenviar email de verificacion
 * 
 * @route /v1/user/resend
 * @method post
 */
UserRouter.post('/resend', userController.resend);

/**
 * Authenticar usuario
 * 
 * @route /v1/user/auth
 * @method post
 */
UserRouter.post('/auth', userController.auth);

/**
 * Verificar la cuenta de correo con la que se ha registrado el usuario
 * 
 * @route /v1/user/verification
 * @method get
 */
UserRouter.post('/verification', userController.verifyAccount);

/**
 * Nueva contraseña
 * 
 * @route /v1/user/newpassword
 * @method post
 */
UserRouter.post('/newpassword', userController.newPassword);

/**
 * Olvido de contraseña
 * 
 * @route /v1/user/forgot
 * @method post
 */
UserRouter.post('/forgot', userController.forgot);

/**
 * Verificar el token de la contraseña
 * 
 * @route /v1/user/verifytoken
 * @method post
 */
UserRouter.post('/verifytoken', userController.verifyTokenPassword);

/**
 * Obtener un usuario
 * 
 * @route /v1/user/user
 * @method get
 */
UserRouter.get('/user', Authentication.jwt, userController.user);

/**
 * Obtener un usuario
 * 
 * @route /v1/user/user
 * @method get
 */
UserRouter.get('/id/:id', Authentication.jwt, userController.getById);


/**
 * Mensaje de contactanos
 * 
 * @route /v1/user/contactus
 * @method post
 */
UserRouter.post('/contactus', userController.contactUs);

/**
 * Obtener las conexiones de un usuario
 * 
 * @route /v1/user/connections
 * @method get
 */
UserRouter.get('/connections', Authentication.jwt, userController.connections);

/**
 * modifica los datos de un usuario, obtiene el id con el access-token
 * @route /v1/user/update
 * @method put
 */

UserRouter.put('/update',Authentication.jwt,userController.updateOne)
/**
 * Obtiene los usuarios registrados, necesita el access-token para evitar mostrar el token por la web
 * @route /v1/user/users
 * @method get
 */

UserRouter.get('/users',Authentication.jwt,userController.getUsers)

/**
 * Obtiene los datos de un usuario por su username
 * @route /v1/user/username/:username
 * @method get
 */

UserRouter.get('/username/:username',userController.getUser)

/**
 * Modifica los datos de una marca Sponsor
 * @route /v1/user/username/:username
 * @method get
 */

UserRouter.post('/sponsors',Authentication.jwt,userController.updateSponsors)

/**
 * Los 5 usuarios mas seguidos, para agregar
 */

 UserRouter.get('/fivepopular',Authentication.jwt,userController.mostPopulateUsersToAdd)

 /**
 * Obtiene todos los administradores
 */

UserRouter.get('/admins',Authentication.jwt,userController.findAdmins)


module.exports = UserRouter;
