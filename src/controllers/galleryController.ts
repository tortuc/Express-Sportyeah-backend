import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import Gallery from "../models/gallery";
import User from "../models/user";

/**
 * GalleryController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class GalleryController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Crea o guarda un archivo en la galeria
   *
   * @route /v1/gallery/create
   * @method post
   */
  public create(request: Request, response: Response) {
    // Recuperamos el id del usuario que sube la imagen
    const { id } = request.body.decoded;
    // Recuperamos los datos del archivo que quiere guardar
    let file = request.body.file;

    // asignamos el usuario al que pertenece el archivo
    file.user = id;

    Gallery.createOne(file)
      .then(async (newFile) => {
        await User.populate(newFile, { path: "user" });
        response.status(HttpResponse.Ok).json(newFile);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }

  /**
   * Obtiene la galeria de un usuario
   */

  public getGalleryByUserId(request: Request, response: Response) {
    /**
     * Recuperamos el id del usuario, desde el parametro
     */
    const { id,skip } = request.params;
    let skips = Number(skip)

    Gallery.getGalleryByUserID(id,skips)
      .then((gallery) => {
        response.status(HttpResponse.Ok).json(gallery);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }

  /**
   * Eliminar un archivo de la galeria
   */

  deleteFile(request: Request, response: Response) {
    // obtenemos el id del archivo
    const { id } = request.params;
    Gallery.deleteFile(id)
      .then((fileDeleted) => {
        response.status(HttpResponse.Ok).json(fileDeleted);
      })
      .catch((err) => response.status(HttpResponse.BadRequest).send(err));
  }
}
