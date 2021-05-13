import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import Roles from "../models/roles";

/**
 * RolesController
 *
 * Contiene los controladores de los roles y permisos
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

export class RolesController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Crear un role de administrador
   * @param request 
   * @param response 
   */

  createRole(request: Request, response: Response) {
    let data = request.body.data;
    Roles.newRole(data)
      .then((role) => {
        response.status(HttpResponse.Ok).json(role);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot create role");
      });
  }

  /**
   * Obtener todos los roles creados
   * @param request
   * @param response
   */

  getRoles(request: Request, response: Response) {
    Roles.getRoles()
      .then((roles) => {
        response.status(HttpResponse.Ok).json(roles);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot get roles");
      });
  }
  /**
   * Editar un role
   */

  updateRole(request: Request, response: Response) {
    // obtenemos el id del rol
    let id = request.params.id;
    // y la nueva data del rol
    let data = request.body.data;
    Roles.updateRoles(id, data)
      .then((roleUpdate) => {
        // editamos el rol y respondemos con el rol editado
        response.status(HttpResponse.Ok).json(roleUpdate);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot update role");
      });
  }

  /**
   * Obtener un role y su informacion
   * @param request
   * @param response
   */
  findOne(request: Request, response: Response) {
    // obtenemos el id del role
    let role = request.params.id;
    // buscamos su informacion
    Roles.getRole(role)
      .then((role) => {
        // respondemos con la informacion del role
        response.status(HttpResponse.Ok).json(role);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("cannot get role");
      });
  }
}
