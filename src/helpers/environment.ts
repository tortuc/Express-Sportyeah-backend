/**
 * Clase Enviroment
 *
 * Obtiene el entorno de despliegue de la aplicación
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

import { Config } from "./config";

export class Environment {
  /**
   * Entornos de despliegue admitidos
   */
  public static Development: Environment = new Environment("development");

  public static Production: Environment = new Environment("production");

  public static Test: Environment = new Environment("test");

  /**
   * El entorno de despliegue de la aplicación
   */
  protected environment: string;

  /**
   * El constructor
   *
   * @param {string} environment  El entorno de despligue
   */
  public constructor(environment: string) {
    this.environment = environment;
  }

  /**
   * El método toString
   *
   * @return {string}
   */
  public toString(): string {
    return this.environment;
  }

  /**
   * Obtiene el entorno de despliegue de la aplicación
   *
   * @return {Environment} El entorno de despligue de la aplicación
   */
  public static get(): Environment {
    // si la variable de entorno es production entonces se carga en production
    switch (process.env.NODE_ENV) {
      case "production":
        return Environment.Production;
        break;
      case "test":
        return Environment.Test;
        break;

      default:
        return Environment.Development;
        break;
    }
  }
}
