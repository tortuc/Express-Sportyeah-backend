import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import Sponsor from "../models/sponsor";
import User from "../models/user";

/**
 * SponsorController
 *
 * Controlador para los sponsors
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
 */

export class SponsorController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Crear un patrocinador
   */
  createSponsor(request: Request, response: Response) {
    // recuperamos la data del patrocinador
    const sponsor = request.body;
    // lo creamos
    Sponsor.createOne(sponsor)
      .then(async (newSponsor) => {
        await User.populate(newSponsor, { path: "idSponsor" });
        // respondemos con el nuevo patrocinador
        response.status(HttpResponse.Ok).json(newSponsor);
      })
      .catch((err) => {
        // En caso de que ocurra un error, respondemos con el mismo
        response.status(HttpResponse.BadRequest).send(err);
      });
  }

  /**
   * Eliminar un patrocinador
   */

  deleteSponsorById(request: Request, response: Response) {
    // recuperamos el id del patrocinador
    const { id } = request.params;

    Sponsor.deleteSponsor(id)
      .then(async (sponsor) => {
        let sponsors = await Sponsor.getSponsorsByUser(sponsor.user);
        response.status(HttpResponse.Ok).json(sponsors);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }


  /**
   * Editar  un patrocinador
   */

  updateSponsorById(request: Request, response: Response) {
    // recuperamos el id del patrocinador
    const { id } = request.params;
    const newData = request.body;
    Sponsor.updateSponsor(id,newData)
      .then(async (sponsor) => {
        let sponsors = await Sponsor.getSponsorsByUser(sponsor.user);
        response.status(HttpResponse.Ok).json(sponsors);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  /**
   * Obtiene todos los patrocinadores de un usuario
   */
  getSponsorByUserId(request: Request, response: Response) {
    // recuperamos el id del usuario
    const { id } = request.params;

    Sponsor.getSponsorsByUser(id)
      .then((sponsors) => {
        // respondemos con los patrocinadores
        response.status(HttpResponse.Ok).json(sponsors);
      })
      .catch((err) => {
        // En caso de que ocurra un error, respondemos con el mismo
        response.status(HttpResponse.BadRequest).send(err);
      });
  }

  /**
   * busca a patrocinadores de sportyeah, por una cadena de texto
   */
  public searchSponsorQuerySkip(request: Request, response: Response) {
    let query = request.params.query; // obtenemos la busqueda o el texto que ingreso el usuario
    let skip = Number(request.params.skip); // obtenemos la paginacion y la convertimos a numero
    // buscamos a los usuarios que coincidan con la busqueda
    User.searchQuerySponsors(query, 15, skip)
      .then((users) => {

        // hacemos el populate de los usuarios para obtener su data
        User.populate(users, { path: "_id" }).then((users) => {
          users = users.map((user) => {
            return user._id;
          });
          response.status(HttpResponse.Ok).json(users);
        });
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }
}
