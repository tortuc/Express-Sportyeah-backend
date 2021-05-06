/**
 * Clase Analytic
 *
 * Fachada con funciones de
 * analiticas
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 *
 */

import * as moment from "moment";
import AnalyticProfile from "../models/analyticsProfile";
// import Event from "../models/event";
import User from "../models/user";

export class Analytic {
  /**
   * El constructor es privado
   */
  private constructor() {
    // Constructor Privado
  }

  /**
   * Retorna la cantidad de registros de usuarios en una semana especifica
   * @param day dia de la semana puede ser cualquiera
   * @returns
   */
  public static async signupsInWeek(day) {
    let days = [];
    for (let index = 0; index < 7; index++) {
      let start = moment(day).startOf("week");
      days.push(await User.getUsersByDate(start.add(index, "days")));
    }
    return days;
  }

  // /**
  //  * Retorna la cantidad de eventos creados en una semana
  //  * @param day
  //  * @returns
  //  */
  // public static async eventsInWeek(day) {
  //   let days = [];
  //   for (let index = 0; index < 7; index++) {
  //     let start = moment(day).startOf("week");
  //     days.push(await Event.getEventsByDate(start.add(index, "days")));
  //   }
  //   return days;
  // }

  /**
   * Cantidad de visitas a un perfil, por semana
   * @param day
   * @param user _id del perfil (usuario)
   * @returns
   */
  public static async visitsInWeek(day, user) {
    let days = [];
    for (let index = 0; index < 7; index++) {
      let start = moment(day).startOf("week");
      days.push(
        await AnalyticProfile.getVisitsByDate(user, start.add(index, "days"))
      );
    }
    return days;
  }


  /**
   * Cantidad de usuarios conectados
   * @returns
   */
  public static async usersOnlines() {
    // obtenemos el total de usuarios
    let total = await User.countOfUsers();
    // obtenemos la cantidad de usuarios conectados actualmente
    let connecteds = await User.countOfUsersOnlines();
    // respondemos con la cantidad de contectados, el total y la cantidad de desconectados
    let users = {
      connecteds,
      total,
      disconnects: total - connecteds,
    };
    return users;
  }
  /**
   * Data de usuarios de kecuki, que visitaron un evento en especifico
   * @param day dia para calcular la semana
   * @param analytics cuerpo de la analitica de un evento
   */

  public static async kecukiUsersVisitsEventData(day, analytics) {
    let days = [];
    for (let index = 0; index < 7; index++) {
      let start = moment(day).startOf("week");

      days.push(
        this.kecukiUsersVisitsEvent(
          analytics.InvitedUserVisits,
          start.add(index, "days")
        )
      );
    }

    return days;
  }

  /**
     * Cantidad de usuarios de kecuki, que visitaron un evento en especifico

   * @param visits 
   * @param date 
   * @returns 
   */
  private static kecukiUsersVisitsEvent(visits: any[], date) {
    let day = moment(new Date(date));
    let total = visits.filter((visit) => {
      return (
        moment(new Date(visit.Date)).format("YYYY-MM-DD") ==
        day.format("YYYY-MM-DD")
      );
    });
    return total.length;
  }
  public static async usersInvitedVisitsEventData(day, analytics) {
    let days = [];
    for (let index = 0; index < 7; index++) {
      let start = moment(day).startOf("week");

      days.push(
        this.usersInvitedVisitsEvent(
          analytics.pendingInvitationVisits,
          start.add(index, "days")
        )
      );
    }

    return days;
  }

  private static usersInvitedVisitsEvent(visits: any[], date) {
    let day = moment(new Date(date));
    let total = visits.filter((visit) => {
      return (
        moment(new Date(visit.Date)).format("YYYY-MM-DD") ==
        day.format("YYYY-MM-DD")
      );
    });
    return total.length;
  }
  public static async offlineVisitsEventData(day, analytics) {
    let days = [];
    for (let index = 0; index < 7; index++) {
      let start = moment(day).startOf("week");

      days.push(
        this.offlineVisitsEvent(
          analytics.externalVisits,
          start.add(index, "days")
        )
      );
    }

    return days;
  }

  private static offlineVisitsEvent(visits: any[], date) {
    let day = moment(new Date(date));
    let total = visits.filter((visit) => {
      return (
        moment(new Date(visit.Date)).format("YYYY-MM-DD") ==
        day.format("YYYY-MM-DD")
      );
    });
    return total.length;
  }
}
