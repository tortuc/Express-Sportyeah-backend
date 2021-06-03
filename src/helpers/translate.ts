/**
 * Clase Admin
 *
 * Crea un usuario Super Administrador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 *
 */

import * as fs from "fs";
import * as path from "path";
import { Languajes } from "./languajes";

export class Translate {
  /**
   * El constructor
   */
  private constructor() {
    // Constructor Privado
  }

  /**
   * Obtiene un texto con su respectiva traduccion, funciona casi igual a ngx-translate
   * @param text Texto a traducir `test.hello` o `testbasic`
   * @param lang Idioma para obtener el texto traducido
   *
   * Si no consigue el texto solicitado, en el json de idiomas seleccionado, entonces devolvera el mismo texto que se le paso
   */
  public static get(text: string, lang: Languajes): Promise<string> {
    return new Promise((resolve) => {
      fs.readFile(
        path.resolve(__dirname + `/../langs/${lang}.json`),
        "utf-8",
        (error, data: any) => {
          if (error) {
            resolve(text);
          } else {
            const json = JSON.parse(data);
            let responseText = json;
            text.split(".").forEach((chunk) => {
              responseText = responseText[chunk];
            });
            if (typeof responseText == "string") {
              resolve(responseText);
            } else {
              resolve(text);
            }
          }
        }
      );
    });
  }
}
