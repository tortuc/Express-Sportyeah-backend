import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import Sponsor from "../models/sponsor";
import { SponsorFilter } from "../helpers/SponsorFilter"
/**
 * ViewsProfileController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class ViewsSponsorController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

/**
   * Cuando el usuario entre en su pefil privado
   *
   * @param request
   * @param response
   */
 public createSponsorView(request: Request, response: Response) {
  // verifica si existe un Sponsor para este usuario
  Sponsor.createSponsorView(request.body)
    .then((views) => {
      response.status(HttpResponse.Ok).json(views);
    })
    .catch((err) => {
      response.status(HttpResponse.BadRequest).json(err);
    });
}

  /**
   * Cuando el usuario entre en su pefil privado
   *
   * @param request
   * @param response
   */
  public getSponsorView(request: Request, response: Response) {
    // verifica si existe un Sponsor para este usuario
    
    Sponsor.getSponsorView(request.params.id)
      .then((views) => {
        response.status(HttpResponse.Ok).json(views);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).json(err);
      });
  }

  

  /**
   * Cuando el usuario entre en su pefil privado
   *
   * @param request
   * @param response
   */
   public getPostViewsByTime(request: Request, response: Response) {
    let { id,dateStart, dateEnd} = request.params

    // verifica si existe un Sponsor para este usuario
    Sponsor.getPostViewsByTime(id,dateStart,dateEnd)
      .then((views) => {
        response.status(HttpResponse.Ok).json({views});
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).json(err);
      });
  }

  /**
   * Cuando el usuario entre en su pefil privado
   *
   * @param request
   * @param response
   */
   public getPostViewsByDay(request: Request, response: Response) {
    let { id,dateStart, dateEnd} = request.params
    // verifica si existe un Sponsor para este usuario
    Sponsor.getPostViewsByDay(id,dateStart,dateEnd)
      .then((views) => {
        response.status(HttpResponse.Ok).json({views});
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).json(err);
      });
  }


  /**
   * Retorna la cantidad de visitas al perfil en una semana
   * @param request
   * @param response
   */
   public async getVisitsByWeek(request: Request, response: Response) {
     let {date,id,from } = request.params
    
    try {
      let events = await SponsorFilter.getSponsorViewsCountWeek(date, id,from);
      response.status(HttpResponse.Ok).json(events);
    } catch (error) {
      console.log(error);
      
      response.status(HttpResponse.BadRequest).send(error);
    }
  }
  

   /**
   * Retorna la cantidad de visitas al perfil en una mes
   * @param request
   * @param response
   */
    public async getVisitsByMonth(request: Request, response: Response) {
      let {date,id,from } = request.params
     
     try {
       let events = await SponsorFilter.getSponsorViewsCountMonth(date, id,from);
       response.status(HttpResponse.Ok).json(events);
     } catch (error) {
       console.log(error);
       
       response.status(HttpResponse.BadRequest).send(error);
     }
   }

    /**
   * Retorna la cantidad de visitas al perfil en una anio
   * @param request
   * @param response
   */
     public async getVisitsByYear(request: Request, response: Response) {
      let {date,id,from } = request.params
     
     try {
       let events = await SponsorFilter.getSponsorViewsCountYear(date, id,from);
       response.status(HttpResponse.Ok).json(events);
     } catch (error) {
       console.log(error);
       
       response.status(HttpResponse.BadRequest).send(error);
     }
   }


    /**
   * Retorna la cantidad de visitas al perfil en una día
   * @param request
   * @param response
   */
     public async getVisitsByHour(request: Request, response: Response) {
      let {date,id,from } = request.params
     
     try {
       let events = await SponsorFilter.getSponsorViewsCountHours(date, id,from);
       response.status(HttpResponse.Ok).json(events)
     } catch (error) {
       console.log(error);
       response.status(HttpResponse.BadRequest).send(error);
     }
   }

   /**
   * Retorna la cantidad de visitas al perfil en una anio Para el PDF
   * @param request
   * @param response
   */
    public async getVisitsByYearPdf(request: Request, response: Response) {
      let {date,id,name} = request.params
     try {
      let events = await SponsorFilter.getSponsorYearPdf(date, id,name);
      let total = 0;
      for(let element of events.year){
        total += element.total;
      }
      events.total = total;
      response.status(HttpResponse.Ok).json(events);
     } catch (error) {
       console.log(error);
       response.status(HttpResponse.BadRequest).send(error);
     }
   }
}
