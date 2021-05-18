/**
 * Clase postFilter
 *
 * Se usa para filtrar los comenterios, publicaciones, likes
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 *
 */
 import Sponsor from "../models/viewsSponsor";
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
  public static async getSponsorViewsCountWeek(day, user,from,name) {
    
    
    let days = [];
    for (let index = 0; index < 7; index++) {
      let start = moment(day).startOf("week");
      days.push(
        await Sponsor.getVisitsByDate(user, start.add(index, "days"),from,name)
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
   public static async getSponsorViewsCountMonth(day, user,from,name) {
    
    
    let days = [];
    for (let index = 0; index < moment(day).daysInMonth(); index++) {
      let start = moment(day).startOf("month");
      days.push(
        await Sponsor.getVisitsByDate(user, start.add(index, "days"),from,name)
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
    public static async getSponsorViewsCountYear(day, user,from,name) {
      let days = [];
      let dayBeging = moment(day).startOf("year");
      for (let index = 0; index < 12; index++) {
        let start = moment(day).startOf("year");
        days.push(
          await Sponsor.getVisitsByMonth(user, start.add(index, "month"),from,name)
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
     public static async getSponsorViewsCountHours(day, user,from,name) {
      let days = [];
      for (let index = 0; index < 24; index++) {
        let start = moment(day).startOf("day");
        days.push(
          await Sponsor.getVisitsByHour(user, start.add(index, "hour"),from,name)
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
       public static async getSponsorYearPdf(day, user,name) {
        let fromArray = ['post', 'chat','search','profile','reaction','comment','ranking','news']
        let totalDates = {year:[],total:0}
        let totalYear = 0; 
        let month
        for(let element of fromArray){
           month = [];
           totalYear = 0;
          for (let index = 0; index < 12; index++) {
            let start = moment(day).startOf("year");
          let count = await Sponsor.getVisitsByYear(user, start.add(index, "month"),element,name)
          month.push(
              count
            );
              // days.total += count;
              totalYear += count; 
          }
          totalDates.year.push({dataYear:month,from:element,total:totalYear})
        }
        return totalDates;
      }
  }
  