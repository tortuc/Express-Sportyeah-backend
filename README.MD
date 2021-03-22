# Backend de la aplicación

Este documento refleja como trabajar el backend de la aplicación.

version 2.0
Jogeiker L <jogeiker1999@gmail.com>
(c) Sapviremoto

# Conexión a la instancia AWS

Para conectarnos al repositorio remoto usamos git y ssh con el certificado kudiskaServer.pem:

Dominio : www.sportyeah.com
usuario : ubuntu
ppk : sportyeah.ppk

ssh -i sportyeah.pem ubuntu@sportyeah.com


## Crear una carpeta para los repositorios

mkdir /home/user/kudiska

Hemos creado la carpeta kudiska en la carpeta de nuestro usuario.

## Crear el repositorio de Frontend

cd /home/user/kudiska

Clonamos el repositorio del frontend:

git clone git+ssh://ubuntu@kudiska.com/var/git/frontend.git

Ahora en:

cd /home/user/kudiska/frontend

Tenemos el frontend de la aplicación.

Podemos utilizar un cliente git o bien:

git commit -m "my commit"       Para confirmar los cambios en nuestro repositorio local
git push                        Para enviar los cambios al repositorio remoto

## Clonar el repositorio de Backend

cd /home/user/kudiska

Clonamos el repositorio del backend:

git clone git+ssh://ubuntu@kudiska.com/var/git/backend.git

Ahora en:
cd /home/user/kudiska/backend

# Estructura baśica

La carpeta /src contiene el código fuente de la aplicación.
La carpeta /build contiene la aplicación compilada.
El archivo package.json contiene las dependencias del proyecto

## Compilar el proyecto 🚀

En desarrollo ejecutar:

npm run tsc

Para iniciar el compilador de typescript.

## Hacer un build

El proyecto contiene otros recursos que no se compilan:

app.config      El archivo de configuración de la aplicación.
/src/views      Las vistas utilizadas por el motor de plantllas hbs

Cuando se compila (se hace un build del proyecto), además de compilar el typescript, se llevan los recursos a la carpeta build.

El resultado de la compilación queda en /build.

Para hacer un build:

npm run build

## Desplegar la aplicación 🚀

Hacer:

npm start

## Instalación de nuevas librerías

Se realiza desde la raíz del proyecto, que contiene el archivo package.json:

npm install {nombre-libreria}

## Estructura del código fuente 🚀

Tenemos las carpetas:

/helpers         Contiene clases de ayuda
/controllers     Contiene los controladores de la aplicación
/models          Contiene los modelos de la aplicación
/routes          Contienen las rutas
/views           Contienen las vistas hbs
app.config       Archivo de configuración de la aplicación
kudiska.js       Lanza la aplicación (punto de entrada)

## Configuración

Se encuentra en el archivo app.config.

Para obtener un valor de configuración:

    import { Config } from "./config";

Hacemos:

    const host:string = Config.get('mail.smtp.host');

Esto lee la siguiente clave del archivo de configuración:

    [mail.smtp]

    host=smtp.kudiska.com

## Entornos

La aplicación obtiene la configuración adecuada automáticamente cuando se ejecuta en el entorno de desarrollo o de producción.

Se puede obtener el entorno con:

    import { Environment } from './environment';

    const environment:Environment = Environment.get();

que puede vale Environment.Development cuando la aplicaicón se ejecuta en desarrollo y Environment.Production cuando se ejecuta en producción.

## Rutas

El archivo principal de enrutamiento es:

/routes/router.ts

Para añadir un nuevo archivo de rutas, añadir una nueva sentencia al método Router, por ejemplo:

        /**
         * Manejador de rutas de usuarios
         *
         * @route /users/...
         */
        this.route.use('/users', require('./userRoute'));

Esto crea el grupo de rutas:

    /users/

y da el control a un nuevo archivo de rutas:

    /routes/userRoute.ts

Para crearlo podemos usar el modelo _exampleRouter.ts

    cp _exampleRouter.ts userRouter.ts

y reemplazar example por user:

    import { UserController } from '../controllers/userController';

    /**
    * userRoute
    * 
    * @author Jogeiker L <jogeiker1999@gmail.com>
    * @copyright Sapviremoto
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
    * index
    * 
    * Ruta por defecto
    * 
    * @route /example/
    * @method get
    */
    UserRouter.get('/', userController.index);

    module.exports = UserRouter;

Más adelante crearemos el controladore que maneje estas rutas UserController.ts

## Controladores 🚀

Se ubican en:

    /contollers

Para crear un controlador nuevo usamos el ejemplo:

    cp _exampleController.ts UserController.ts

y susituimos example por user:

    import { BaseController } from './baseController';

    /**
    * UserController
    * 
    * Explica el objeto de este controlador
    *  
    * @author Jogeiker L <jogeiker1999@gmail.com>
    * @copyright Sapviremoto
    */
    
    export class UserController extends BaseController
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
        * Ruta por defecto
        * 
        * @route /example/
        * @method get
        */
        public index(request:any, response:any)
        {
            // Envía una respuesta
            response.send(`[OK] Mensaje de bienvenida enviado con éxito`);
        }
    }

Cada método del controlador es una acción llamada por una ruta.

Por ejemplo, para crear la acción /user/delete que elimina un usuario, debemos dar de alta la ruta en userRoute.ts:

    /**
    * delete
    * 
    * Borra un usuario
    * 
    * @route /user/delete
    * @method post
    */
    UserRouter.delete('/delete/:id', userController.delete);

Elegimos el método POST, puede usarse GET, DELETE.

y luego crear la acción delete en userController.ts:

        /**
        * Borra un usuario
        * 
        * @route /user/delete
        * @method post
        */
        public delete(request:any, response:any)
        {
            // Envía una respuesta
            response.send(`[OK] Usuario eliminado con éxito`);
        }

## Modelos 🚀

Se guardan en la carpeta models. Un ejemplo de modelo se ofrece en:

test.ts

Para todo sobre los modelos:

https://www.npmjs.com/package/ts-mongoose

Un modelo tiene la siguiente estructura básica con tres partes:

1. Definir un esquema del modelo con el método createSchema:

    const schema = createSchema({
    ...
    });

2. Crear el objeto del modelo aplicado el método de factoría de clases typedModel. Esto genera la clase de objeto Test.

La forma básica es:

        const Test = typedModel('Test', schema); 

Se suministra el nombre de la clase a crear y el esquema que hemos creado. Este método crea además la inferface correspondiente.

Una forma más completa que permite crear métodos estáticos es:

    const Test = typedModel('Test', schema, undefined, undefined, 
        {
            /**
            * Obtiene el primer test con un nombre dado
            * 
            * @param {string} name     El nombre
            */
            findOneByName: function (name: string) {
                return this.findOne({ name : name });
            },

            /**
            * Obtiene todos los tests con un nombre dado
            * 
            * @param {string} name   El nombre
            */
            findByName: function (name: string) {
                return this.find({ name: name });
            },

            /**
            * Obtiene todos los tests de un fabircante dado
            * 
            * @param {string} vendor   El fábricante
            */
            findByVendor: function (vendor: string) {
                return this.find({ vendor: vendor });
            },
        }
    );

3. Exportar la clase creada para dejarla disponible.

    export default Test;

## Envío de Correo

Envío de un mensaje de correo sencillo:

    Mail.send(
        {
            to          : 'jogeiker1999@gmail.com', // Detinatario/s del mensaje
            subject     : 'test',            // El asunto
            message     : 'test'             // El mensaje
        }
    ).then(result => {
        
    }).catch(error => {
        console.error('Se ha producido un error al intentar enviar el correo');
    });

Envío de un mensaje de correo utilizando una plantilla ubicada en la carpeta /views/mail/:
        
    Mail.send(
        {
            to          : 'jogeiker1999@gmail.com', // Detinatario/s del mensaje
            subject     : 'test',            // El asunto
            template    : 'welcome'          // La plantilla /views/mail/welcome.html
            context     :
                {
                    name        : name,
                    lastname    : lastname,
                    email       : email
                }
        }
    ).then(result => {
        
    }).catch(error => {
        console.error('Se ha producido un error al intentar enviar el correo');
    });




# TAREAS DAVID:

 Crear modelo para manejo de esos 5 apartados:                                                                                                                                               
- 1- Crear modelo, con funciones normales de crud y que el delete solo cambie el estado.
- 2- Crear controlador para manejar este modelo.
- 3- Crear nueva ruta para manejar este controlador.
- 4- Agregar nueva ruta al controlador de la ruta.








































