/**
 * Clase postFilter
 *
 * Se usa para filtrar los comenterios, publicaciones, likes
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 *
 */
 import * as moment from 'moment';
 import ViewsProfile from "../models/viewsProfile";


 export class ViewsProfileFilter {
   private constructor() {
     // Constructor Privado
   }
 
   /**
    * Retorna el cantidad de vistas del tipo 'search'
    * @param view la vista 
    * @returns
    */
    public static async getViewsCountSearch(view): Promise<any> {
     // retornamos una promesa
     return new Promise(async (resolve) => {
         view.count = 0;
        //  console.log('antes ///////////////////////');
        //  console.log(view._id.count);
         view._id.visits.map((visits)=>{
            // console.log(visits);
            if(visits.from == 'search'){
                view.count++
            }
         })
        //  console.log('AHORA ///////////////////////');
        //  console.log(view._id.count);
    resolve(view.count);
     });
   }

    /**
   * Cantidad de visitas a un perfil, por semana
   * @param day
   * @param user _id del perfil (usuario)
   * @returns
   */
  public static async getUserViewsCount(day, user,from) {
    
    
    let days = [];
    for (let index = 0; index < 7; index++) {
      let start = moment(day).startOf("week");

      days.push(
        await ViewsProfile.getVisitsByDate(user, start.add(index, "days"),from)
      );
      
    }
    return days;
  }
 }
 