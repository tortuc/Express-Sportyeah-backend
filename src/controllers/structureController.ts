import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { request, Request, Response } from "express";
import Structure from "../models/structure";
import OrganizationProfile from "../models/organizationProfile";
import User from "../models/user";
import StructureDivision from "../models/structureDivision";
import StructureCategory from "../models/structureCategory";
import StructureTeam from "../models/structureTeam";
import StructurePlayer from "../models/structurePlayer";

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

  async getStructureByUsername(request: Request, response: Response) {
    try {
      const { username } = request.params;
      const user = await User.findByUsername(username);
      if (["club"].includes(user.profile_user)) {
        const structure = await Structure.findByUSer(user._id);
        response.status(HttpResponse.Ok).json(structure);
      } else {
        response.status(HttpResponse.Unauthorized).send("profile invalid");
      }
    } catch (error) {
      response.status(HttpResponse.BadRequest).send(error);
    }
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

  /**
   * ----------------------------------------------------------
   * ----------------- CRUD DIVISIONES ------------------------
   * ----------------------------------------------------------
   */

  /**
   * Crear una division
   */
  createDivision(request: Request, response: Response) {
    const division = request.body;
    StructureDivision.createOne(division)
      .then((division) => {
        StructureCategory.createDefaultCategorys(division._id);
        response.status(HttpResponse.Ok).json(division);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  /**
   * Obtiene todas las divisones de una estructura
   */
  getAllDivisionByStructure(request: Request, response: Response) {
    const { id } = request.params;

    StructureDivision.getAllByStructure(id)
      .then((divisions) => {
        response.status(HttpResponse.Ok).json(divisions);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  /**
  /**
   * Obtiene todas las divisones de una estructura
   */
  async getAllDivisionByUsername(request: Request, response: Response) {
    try {
      const { username } = request.params;
      const user = await User.findByUsername(username);
      const structure = await Structure.findByUSer(user._id);
      const divisions = await StructureDivision.getAllByStructure(
        structure._id
      );
      response.status(HttpResponse.Ok).json(divisions);
    } catch (error) {
      response.status(HttpResponse.BadRequest).send(error);
    }
  }

  /**
   * Obtiene todas las divisones de una estructura
   */
  getDivisionById(request: Request, response: Response) {
    const { id } = request.params;

    StructureDivision.getOne(id)
      .then((division) => {
        response.status(HttpResponse.Ok).json(division);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  /**
   * Editar division
   */

  updateDivisionById(request: Request, response: Response) {
    const { id } = request.params;
    const newData = request.body;
    StructureDivision.updateDivision(id, newData)
      .then((division) => {
        response.status(HttpResponse.Ok).json(division);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  /**
   * Eliminar una division
   */

  deleteDivisionById(request: Request, response: Response) {
    const { id } = request.params;
    StructureDivision.deleteDivision(id)
      .then((division) => {
        response.status(HttpResponse.Ok).json(division);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  /**
   * ----------------------------------------------------------
   * ----------------- END CRUD DIVISIONES --------------------
   * ----------------------------------------------------------
   */

  /**
   * ----------------------------------------------------------
   * -------------------- CRUD CATEGORIAS ---------------------
   * ----------------------------------------------------------
   */

  createCategory(request: Request, response: Response) {
    const category = request.body;
    StructureCategory.createOne(category)
      .then((newCategory) => {
        StructureTeam.createDefaultTeams(newCategory._id);
        response.status(HttpResponse.Ok).json(newCategory);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  getAllCategoriesByDivision(request: Request, response: Response) {
    const { id } = request.params;
    StructureCategory.getAllByDivision(id)
      .then((categories) => {
        response.status(HttpResponse.Ok).json(categories);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  getCategoriaById(request: Request, response: Response) {
    const { id } = request.params;
    StructureCategory.getOne(id)
      .then((category) => {
        response.status(HttpResponse.Ok).json(category);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  updateCategoryById(request: Request, response: Response) {
    const { id } = request.params;
    const newData = request.body;
    StructureCategory.updateCategory(id, newData)
      .then((category) => {
        response.status(HttpResponse.Ok).json(category);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }
  deleteCategoryById(request: Request, response: Response) {
    const { id } = request.params;

    StructureCategory.deleteCategory(id)
      .then((category) => {
        response.status(HttpResponse.Ok).json(category);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  /**
   * ----------------------------------------------------------
   * ----------------- END CRUD CATEGORIAS --------------------
   * ----------------------------------------------------------
   */
  /**
   * ----------------------------------------------------------
   * -------------------- CRUD EQUPOS ---------------------
   * ----------------------------------------------------------
   */

  createTeam(request: Request, response: Response) {
    const team = request.body;
    StructureTeam.createOne(team)
      .then((newTeam) => {
        StructurePlayer.createDefaultPlayers(newTeam._id);
        response.status(HttpResponse.Ok).json(newTeam);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  getAllTeamsByCategory(request: Request, response: Response) {
    const { id } = request.params;
    StructureTeam.getAllByCategory(id)
      .then((teams) => {
        response.status(HttpResponse.Ok).json(teams);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  getTeamById(request: Request, response: Response) {
    const { id } = request.params;
    StructureTeam.getOne(id)
      .then((team) => {
        response.status(HttpResponse.Ok).json(team);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  updateTeamById(request: Request, response: Response) {
    const { id } = request.params;
    const newData = request.body;
    StructureTeam.updateTeam(id, newData)
      .then((team) => {
        response.status(HttpResponse.Ok).json(team);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }
  deleteTeamById(request: Request, response: Response) {
    const { id } = request.params;

    StructureTeam.deleteTeam(id)
      .then((team) => {
        response.status(HttpResponse.Ok).json(team);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }
  /**
   * ----------------------------------------------------------
   * ----------------- END CRUD Equipos --------------------
   * ----------------------------------------------------------
   */
  /**
   * ----------------------------------------------------------
   * --------------------- CRUD JUGADORES ---------------------
   * ----------------------------------------------------------
   */

  createPlayer(request: Request, response: Response) {
    const player = request.body;
    StructurePlayer.createOne(player)
      .then((newplayer) => {
        response.status(HttpResponse.Ok).json(newplayer);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  getAllPlayersByTeam(request: Request, response: Response) {
    const { id } = request.params;
    const { role } = request.params;
    StructurePlayer.getAllByTeam(id, role)
      .then((players) => {
        response.status(HttpResponse.Ok).json(players);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  getPlayerById(request: Request, response: Response) {
    const { id } = request.params;
    StructurePlayer.getOne(id)
      .then((player) => {
        response.status(HttpResponse.Ok).json(player);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  updatePlayerById(request: Request, response: Response) {
    const { id } = request.params;
    const newData = request.body;
    StructurePlayer.updatePlayer(id, newData)
      .then((player) => {
        response.status(HttpResponse.Ok).json(player);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }
  deletePlayerById(request: Request, response: Response) {
    const { id } = request.params;

    StructurePlayer.deletePlayer(id)
      .then((player) => {
        response.status(HttpResponse.Ok).json(player);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }
  /**
   * ----------------------------------------------------------
   * ----------------- END CRUD JUGADORES ---------------------
   * ----------------------------------------------------------
   */
}
