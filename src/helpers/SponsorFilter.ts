/**
 * Clase postFilter
 *
 * Se usa para filtrar los comenterios, publicaciones, likes
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 *
 */
 import Sponsor from "../models/sponsor";
 import * as moment from 'moment';
 export class SponsorFilter {
    private constructor() {
      // Constructor Privado
    }
  
 /**
   * Cantidad de visitas a un perfil, por semana
   * @param day
   * @param user _id del perfil (usuario)
   * @returns
   */
  public static async getSponsorViewsCountWeek(day, user,from) {
    
    
    let days = [];
    for (let index = 0; index < 7; index++) {
      let start = moment(day).startOf("week");
      days.push(
        await Sponsor.getVisitsByDate(user, start.add(index, "days"),from)
      );
    }
    return days;
  }


  /**
   * Cantidad de visitas a un perfil, por mes
   * @param day
   * @param user _id del perfil (usuario)
   * @returns
   */
   public static async getSponsorViewsCountMonth(day, user,from) {
    
    
    let days = [];
    for (let index = 0; index < moment(day).daysInMonth(); index++) {
      let start = moment(day).startOf("month");
      days.push(
        await Sponsor.getVisitsByDate(user, start.add(index, "days"),from)
      );
    }
    return days;
  }

   /**
   * Cantidad de visitas a un perfil, por anio
   * @param day
   * @param user _id del perfil (usuario)
   * @returns
   */
    public static async getSponsorViewsCountYear(day, user,from) {
      let days = [];
      let dayBeging = moment(day).startOf("year");
      for (let index = 0; index < 12; index++) {
        let start = moment(day).startOf("year");
        days.push(
          await Sponsor.getVisitsByMonth(user, start.add(index, "month"),from)
        );
      }
      
      return days;
    }

    /**
   * Cantidad de visitas a un perfil, por anio
   * @param day
   * @param user _id del perfil (usuario)
   * @returns
   */
     public static async getSponsorViewsCountHours(day, user,from) {
      let days = [];
      let dayBeging = moment(day).startOf("year");
      for (let index = 0; index < 24; index++) {
        let start = moment(day).startOf("day");
        days.push(
          await Sponsor.getVisitsByHour(user, start.add(index, "hour"),from)
        );
      }
      
      return days;
    }
  }
  