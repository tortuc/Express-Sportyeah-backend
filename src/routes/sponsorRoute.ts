import e = require("express");
import { SponsorController } from "../controllers/sponsorController";

/**
 * SponsorRoute
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

/**
 * Carga el controlador
 */
const sponsorController = new SponsorController();

/**
 * Habilita el Router
 */
const SponsorRouter: e.Express = sponsorController.router();

/**
 * Crear un patrocinador
 * @route /v1/sponsor/create
 * @method post
 */
SponsorRouter.post("/create", sponsorController.createSponsor);

/**
 * Elimina un patrocinador
 * @route /v1/sponsor/one/:id
 * @method delete
 */
SponsorRouter.delete("/one/:id", sponsorController.deleteSponsorById);
/**
 * Modifica un patrocinador
 * @route /v1/sponsor/one/:id
 * @method put
 */
SponsorRouter.put("/edit/:id", sponsorController.updateSponsorById);
/**
 * Obtiene todos los patrocinadores de un usuario
 * @param id _id del usuario
 * @route /v1/sponsor/all/:id
 * @method get
 */
SponsorRouter.get("/all/:id", sponsorController.getSponsorByUserId);
/**
 * Obtiene todos los patrocinadores que coincidan con una cadena de texto
 * @param query texto para buscar al sponsor
 * @param skip para la paginacion
 * @route /v1/sponsor/query/:query/:skip
 * @method get
 */
SponsorRouter.get(
  "/query/:query/:skip",
  sponsorController.searchSponsorQuerySkip
);

module.exports = SponsorRouter;
