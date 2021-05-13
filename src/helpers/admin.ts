/**
 * Clase Admin
 *
 * Crea un usuario Super Administrador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 *
 */

import User from "../models/user";
import { Config } from "./config";
import { Crypto } from "./crypto";
export class Admin {
  /**
   * El constructor
   */
  private constructor() {
    // Constructor Privado
  }

  /**
   * Esta funcion crea a un usuario administrador por defecto, si este no existe
   */
  public static createAdmin() {
    User.create(
      new User({
        name: "Administrador",
        last_name: "sportyeah",
        role: "admin",
        email: "admin@sportyeah.com",
        username: "sportyeah",
        password: Crypto.hash("sportyeahadmin2021"),
        verified: true,
        supera: true,
        sport:"various",
        profile_user:"administration"
      })
    )
      .then((user) => {
        // se creo el admin
      })
      .catch(async (err) => {
        await User.findOneAndUpdate(
          { email: "admin@sportyeah.com" },
          { supera: true }
        );

        console.log(`err el admin no se pudo crear`,err);

        // ya el admin existe
      });
  }
}
