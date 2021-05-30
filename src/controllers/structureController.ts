import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { request, Request, Response } from "express";
import Structure from "../models/structure";
import OrganizationProfile from "../models/organizationProfile";
import User from "../models/user";

/**
 * structureController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class StructureController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Obtiene la estructura de club de un perfil
   */

  getStructureByUser(request: Request, response: Response) {
    const { id } = request.params;
    Structure.findByUSer(id)
      .then((structure) => {
        response.status(HttpResponse.Ok).json(structure);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }
  /**
   * Edita la informacion de una  la estructura de club
   */

  updateStructureById(request: Request, response: Response) {
    const { id } = request.params;
    const newData = request.body;
    Structure.updateStructure(id, newData)
      .then((structure) => {
        response.status(HttpResponse.Ok).json(structure);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }

  getStructureByUsername(request: Request, response: Response) {
    const { username } = request.params;
    User.findByUsername(username)
      .then((user) => {
        if (["club"].includes(user.profile_user)) {
          Structure.findByUSer(user._id)
            .then((structure) => {
              response.status(HttpResponse.Ok).json(structure);
            })
            .catch((err) => {
              response.status(HttpResponse.BadRequest).send(err);
            });
        } else {
          response.status(HttpResponse.Unauthorized).send("profile invalid");
        }
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }

  /**
   * Crea un perfil del organigrama
   */
  createOrganizationProfile(request: Request, response: Response) {
    // Obtenemos la informacion
    const profile = request.body;

    OrganizationProfile.createOne(profile)
      .then((newProfile) => {
        response.status(HttpResponse.Ok).json(newProfile);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }

  /**
    Busca todos los perfiles de un organigrama pertenecientes a una estrucura
   */
  getOrganizationChartByStructure(request: Request, response: Response) {
    const { id } = request.params;

    OrganizationProfile.getAllByStructure(id)
      .then((profiles) => {
        response.status(HttpResponse.Ok).json(profiles);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }

  /**
    Busca todos los perfiles de un organigrama pertenecientes a una estrucura (que a su vez se busca por el username)
   */
  async getOrganizationChartByUsername(request: Request, response: Response) {
    try {
      // recuperamos el username
      const { username } = request.params;
      // Obtenemos el usuario
      const user = await User.findByUsername(username);
      // si el perfil del usuario coincide con los que tienen estructura, obtenemos la estrucura de ese usuario
      if (["club"].includes(user.profile_user)) {
        const structure = await Structure.findByUSer(user._id);
        // con la estructura, buscamos el organigrama

        const profiles = await OrganizationProfile.getAllByStructure(
          structure._id
        );
        response.status(HttpResponse.Ok).json(profiles);
      } else {
        response.status(HttpResponse.Unauthorized).send("profile invalid");
      }
    } catch (error) {
      response.status(HttpResponse.BadRequest).send(error);
    }
  }
  /**
   * Edita un perfil del organigrama
   */
  updateProfileOrganizationById(request: Request, response: Response) {
    const { id } = request.params;
    const newData = request.body;
    OrganizationProfile.updateProfileById(id, newData)
      .then((updateProfile) => {
        response.status(HttpResponse.Ok).json(updateProfile);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }

  /**
   * Elimina un perfil del organigrama
   */
  deleteProfileOrganization(request: Request, response: Response) {
    const { id } = request.params;

    OrganizationProfile.deleteOneById(id)
      .then((profile) => {
        response.status(HttpResponse.Ok).json(profile);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }

  /**
   * Obtiene la informacion de un perfil de un organigrama
   * @param request
   * @param response
   */

  getInfoProfileOrganizationById(request: Request, response: Response) {
    const { id } = request.params;
    OrganizationProfile.getInfoByID(id)
      .then((profile) => {
        response.status(HttpResponse.Ok).json(profile);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }
}
