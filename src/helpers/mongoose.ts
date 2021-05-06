/**
 * mongoose
 * Conexión a la base de datos de Mongo
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

 import { connect } from "mongoose";
 import { Config } from "./config";
 import { Environment } from "./environment";
 import { Admin } from "./admin";
 import { QuestionHelper } from "./question"
 export class Mongoose {
   /**
    * Una instancia única del objeto
    */
   private static instance: Mongoose = null;
 
   /**
    * La conexión a la base de datos
    */
   protected connection: any;
 
   /**
    * El constructor
    */
   private constructor() {
     // El momento actual
     let moment: string = new Date().toLocaleTimeString();
 
     // Inicia la conexión
     this.start()
       .then((connection) => {
         console.info(
           `[OK] ${moment} Conexión a Mongo realizada con éxito ${connection}`
         );
         this.connection = connection;
       })
       .catch((error) => {
         console.error(
           `[ERROR] ${moment} Error al conectar con Mongo. No se ha podido establecer la conexión con el servidor\n[ERROR] ${moment} ${error}`
         );
       });
   }
 
   /**
    * Inicia la conexión al servidor mongo
    *
    * @return {Mongoose}
    */
   public static startConnection(): Mongoose {
     let connection: Mongoose;
 
     if (!Mongoose.instance) {
       connection = new Mongoose();
     }
 
     Mongoose.instance = connection;
 
     return connection;
   }
 
   /**
    * Inicia la conexión a Mongo a través del cliente Mongoose
    *
    * @return {Promise}
    */
 
   public start(): Promise<any> {
     return new Promise((resolve, reject) => {
       let connectionString: string;
       let auth = null;
       if (Environment.get() == Environment.Development) {
         connectionString = `mongodb://${Config.get(
           "mongo.development.server"
         )}:${Config.get("mongo.development.port")}/${Config.get(
           "mongo.development.database"
         )}`;
       } else {
         connectionString = `mongodb://${Config.get(
           "mongo.production.server"
         )}:${Config.get("mongo.production.port")}/${Config.get(
           "mongo.production.database"
         )}`;
         auth = {
           user: Config.get("mongo.production.username"),
           password: Config.get("mongo.production.password"),
         };
       }
 
       connect(connectionString, {
         useCreateIndex: true,
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useFindAndModify: false,
         auth,
       })
         .then(() => {
           Admin.createAdmin();
           QuestionHelper.Init();
           resolve(connectionString);
         })
         .catch((error) => {
           reject(`${connectionString} ${error}`);
         });
     });
   }
 }
 