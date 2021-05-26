import e = require("express");
import { GalleryController } from "../controllers/galleryController";
import { Authentication } from "./middleware/authentication";

/**
 * GalleryRoute
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const galleryController = new GalleryController();

/**
 * Habilita el Router
 */
const GalleryRouter: e.Router = galleryController.router();

/**
 *
 * @route /v1/gallery/create
 * @method post
 */
GalleryRouter.post("/create", Authentication.jwt, galleryController.create);
/**
 *
 * @route /v1/gallery/delete/:id
 * @method delete
 */
GalleryRouter.delete(
  "/delete/:id",
  Authentication.jwt,
  galleryController.deleteFile
);
/**
 *
 * @route /v1/gallery/byuser/:id/:skip
 * @method get
 */
GalleryRouter.get("/byuser/:id/:skip", galleryController.getGalleryByUserId);

module.exports = GalleryRouter;
