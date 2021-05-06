import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, response, Response } from "express";
import Like from "../models/like";
import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import Friend from '../models/friend';
import ViewsProfile from '../models/viewsProfile';

/**
 * RankingController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class RankingController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Ruta por defecto
   *
   * @route /example/
   * @method get
   */
  public index(request: Request, response: Response) {
    // Envía una respuesta
    response
      .status(HttpResponse.Ok)
      .send(`[OK] Mensaje de bienvenida enviado con éxito`);
  }

  public getReactionsPostRankingSinceEver(
    request: Request,
    response: Response
  ) {
    let user = request.params.user;
    let country = request.params.country;

    Like.getLikesAllTime().then(async (rankingPosts) => {
      if(rankingPosts.length >= 0 ){
      let ranking = await Post.populate(rankingPosts, {path:"_id"});
      let rankingAndUsers = await User.populate(ranking, {path:"_id.user"});

      if (country != "null") {
        rankingAndUsers = rankingAndUsers.filter((item) => {
          return item._id.user.geo.country == country;
        });
      }
      let total = rankingAndUsers.length;
      let myPosition =
        rankingAndUsers.findIndex((item) => {
          return item._id.user._id == user;
        }) + 1;
      if (myPosition == 0) {
        myPosition = total + 1;
      }
      response.status(200).json({
        myPosition,
        total,
        ranking: rankingAndUsers.slice(0, 3),
      });
    }
    });
  }

  public getSharedPostRankingSinceEver(request: Request, response: Response) {
    let user = request.params.user;
    let country = request.params.country;
    Post.getPostAllTime().then(async (rankingPosts) => {
      if(rankingPosts.length >= 0 ){
      let ranking = await Post.populate(rankingPosts, {path:"_id"});
      let rankingAndUsers = await User.populate(ranking, {path:"_id.user"});

      if (country != "null") {
        rankingAndUsers = rankingAndUsers.filter((item) => {
          return item._id.user.geo.country == country;
        });
      }
      let total = rankingAndUsers.length;
      let myPosition =
        rankingAndUsers.findIndex((item) => {
          return item._id.user._id == user;
        }) + 1;
      if (myPosition == 0) {
        myPosition = total + 1;
      }
      response.status(200).json({
        myPosition,
        total,
        ranking: rankingAndUsers.slice(0, 3),
      });
      }
    });
  }


  public getCommentsPostRankingSinceEver(request: Request, response: Response) {
    let user = request.params.user;
    let country = request.params.country;

    Comment.getCommentAllTime().then(async (rankingPosts) => {
      if(rankingPosts.length >= 0){

      let ranking = await Post.populate(rankingPosts, {path:"_id"});
      let rankingAndUsers = await User.populate(ranking, {path:"_id.user"});

      if (country != "null") {
        rankingAndUsers = rankingAndUsers.filter((item) => {
          return item._id.user.geo.country == country;
        });
      }
      let total = rankingAndUsers.length;
      let myPosition =
        rankingAndUsers.findIndex((item) => {
          return item._id.user._id == user;
        }) + 1;
      if (myPosition == 0) {
        myPosition = total + 1;
      }
      response.status(200).json({
        myPosition,
        total,
        ranking: rankingAndUsers.slice(0, 3),
      });
      }
    });
  }
 
  public getViewsPostRankingSinceEver(request: Request, response: Response) {
    let user = request.params.user;
    let country = request.params.country;

    Post.getPostViewsAllTime().then(async (rankingPosts) => {
      if(rankingPosts.length >= 0){
      let ranking = await Post.populate(rankingPosts, {path:"_id"});
      let rankingAndUsers = await User.populate(ranking, {path:"_id.user"});
      if (country != "null") {
        rankingAndUsers = rankingAndUsers.filter((item) => {
          return item._id.user.geo.country == country;
        });
      }
      let total = rankingAndUsers.length;
      let myPosition =
        rankingAndUsers.findIndex((item) => {
          return item._id.user._id == user;
        }) + 1;
      if (myPosition == 0) {
        myPosition = total + 1;
      }
      response.status(200).json({
        myPosition,
        total,
        ranking: rankingAndUsers.slice(0, 3),
      });
    }
    });
  }

  public getviewsProfileAllSearchRankingSinceEver(request: Request, response: Response) {
    let user = request.params.user;
    let country = request.params.country;

    ViewsProfile.getViewsProfileAllSearchTime().then(async (rankingPosts:any) => {
      let ranking:any = await User.populate(rankingPosts, {path:"_id.user"});
  //  await  rankingPosts.map(async(x) => {
  //   await ViewsProfileFilter.getViewsCountSearch(x)
  //  });
    //organiza de mayor a menor las vistas 
  //  await rankingPosts.sort((a,b)=>{
  //     return b.count - a.count
  //   })  
      if(rankingPosts.length >= 0){
        if (country != "null") {
          ranking = ranking.filter((item) => {
            return item._id.user.geo.country == country;
          });
        }
        let total = ranking.length;
      let myPosition =
        ranking.findIndex((item) => {
          return item._id.user._id == user;
        }) + 1;
        if (myPosition == 0) {
          myPosition = total + 1;
        }
        response.status(200).json({
          myPosition,
          total,
          ranking: ranking.slice(0, 3),
        });
    }
    });
  }

  public getFollowersPostRankingSinceEver(request:Request, response:Response){
    let userReq = request.params.user;
    let country = request.params.country;
    Friend.getfollowersAllTime().then(async(rankingFollowers)=>{
      if(rankingFollowers.length >= 0){
      let ranking:any = await User.populate(rankingFollowers, {path:"_id.user"});
      if (country != "null") {
        ranking = ranking.filter((item) => {
          return item._id.user.geo.country == country;
        });
      }
      let total = ranking.length;
      let myPosition =
        ranking.findIndex((item) => {
          return item._id.user._id == userReq;
        }) + 1;
      if (myPosition == 0) {
        myPosition = total + 1;
      }
      response.status(200).json({
        myPosition,
        total,
        ranking: ranking.slice(0, 3),
      });
    }
    })
    .catch((err)=>{
      err
    })
}

public getViewsProfileReboundAllTime(request: Request, response: Response) {
  let user = request.params.user;
  let country = request.params.country;

  ViewsProfile.getViewsProfileReboundAllTime().then(async (rankingPosts:any) => {
    let ranking:any = await User.populate(rankingPosts, {path:"_id.user"});
 
    if(rankingPosts.length >= 0){
      if (country != "null") {
        ranking = ranking.filter((item) => {
          return item._id.user.geo.country == country;
        });
      }
      let total = ranking.length;
    let myPosition =
      ranking.findIndex((item) => {
        return item._id.user._id == user;
      }) + 1;
      if (myPosition == 0) {
        myPosition = total + 1;
      }
      response.status(200).json({
        myPosition,
        total,
        ranking: ranking.slice(0, 3),
      });
  }
  });
}

  //// Dates
  public getReactionsPostRankingDays(request: Request, response: Response) {
    let user = request.params.user;
    let country = request.params.country;
    let dateStart = request.params.dateStart
    let dateEnd = request.params.dateEnd
    Like.getLikesByTime(dateStart,dateEnd).then(async (rankingPosts) => {
      if(rankingPosts.length >= 0){

      let ranking = await Post.populate(rankingPosts, {path:"_id"});
      let rankingAndUsers = await User.populate(ranking, {path:"_id.user"});

      if (country != "null") {
        rankingAndUsers = rankingAndUsers.filter((item) => {
          return item._id.user.geo.country == country;
        });
      }
      let total = rankingAndUsers.length;
      let myPosition =
        rankingAndUsers.findIndex((item) => {
          return item._id.user._id == user;
        }) + 1;
      if (myPosition == 0) {
        myPosition = total + 1;
      }
      response.status(200).json({
        myPosition,
        total,
        ranking: rankingAndUsers.slice(0, 3),
      });
    }
    });
  }
  public getCommentsPostRankingDays(request: Request, response: Response) {
    let user = request.params.user;
    let country = request.params.country;
    let dateStart = request.params.dateStart
    let dateEnd = request.params.dateEnd

    Comment.getCommentByTime(dateStart,dateEnd).then(async (rankingPosts) => {
      if(rankingPosts.length >= 0){
        let ranking = await Post.populate(rankingPosts, {path:"_id"});
        let rankingAndUsers = await User.populate(ranking, {path:"_id.user"});
        
      if (country != "null") {
        rankingAndUsers = rankingAndUsers.filter((item) => {
          return item._id.user.geo.country == country;
        });
      }
      let total = rankingAndUsers.length;
      let myPosition =
        rankingAndUsers.findIndex((item) => {
          return item._id.user._id == user;
        }) + 1;
      if (myPosition == 0) {
        myPosition = total + 1;
      }
      response.status(200).json({
        myPosition,
        total,
        ranking: rankingAndUsers.slice(0, 3),
      });
      }
    });
  }

  public getSharedPostRankigDays(request: Request, response: Response) {
    let user = request.params.user;
    let country = request.params.country;
    let dateStart = request.params.dateStart
    let dateEnd = request.params.dateEnd

    Post.getPostByTime(dateStart,dateEnd).then(async (rankingPosts) => {
      if(rankingPosts.length >= 0){
      let ranking = await Post.populate(rankingPosts, {path:"_id"});
      let rankingAndUsers = await User.populate(ranking, {path:"_id.user"});

      if (country != "null") {
        rankingAndUsers = rankingAndUsers.filter((item) => {
          return item._id.user.geo.country == country;
        });
      }
      let total = rankingAndUsers.length;
      let myPosition =
        rankingAndUsers.findIndex((item) => {
          return item._id.user._id == user;
        }) + 1;
      if (myPosition == 0) {
        myPosition = total + 1;
      }
      response.status(200).json({
        myPosition,
        total,
        ranking: rankingAndUsers.slice(0, 3),
      });
    }
    });
  }

  public getPostViewsByTime(request: Request, response: Response){
    let { user, country, dateStart, dateEnd} = request.params
    Post.getPostViewsByTime(dateStart,dateEnd)
    .then(async(rankingPosts) => {
      if(rankingPosts.length >= 0){
      let ranking = await Post.populate(rankingPosts, {path:"_id"});
      let rankingAndUsers = await User.populate(ranking, {path:"_id.user"});
      if (country != "null") {
        rankingAndUsers = rankingAndUsers.filter((item) => {
          return item._id.user.geo.country == country;
        });
      }
      let total = rankingAndUsers.length;
      let myPosition =
        rankingAndUsers.findIndex((item) => {
          return item._id.user._id == user;
        }) + 1;
      if (myPosition == 0) {
        myPosition = total + 1;
      }
      response.status(200).json({
        myPosition,
        total,
        ranking: rankingAndUsers.slice(0, 3),
      });
    }
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  public getfollowersByTime(request: Request, response: Response){
    let { user, country, dateStart, dateEnd} = request.params
    Friend.getfollowersByTime(dateStart,dateEnd)
    .then(async(rankingFollowers) => {
      if(rankingFollowers.length >= 0){
        let ranking:any = await User.populate(rankingFollowers, {path:"_id.user"});
      if (country != "null") {
        ranking = ranking.filter((item) => {
          return item._id.user.geo.country == country;
        });
      }
      let total = ranking.length;
      let myPosition =
        ranking.findIndex((item) => {
          return item._id.user._id == user;
        }) + 1;
      if (myPosition == 0) {
        myPosition = total + 1;
      }
      response.status(200).json({
        myPosition,
        total,
        ranking: ranking.slice(0, 3),
      });
    }
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  public getViewsProfileSearchByTime(request: Request, response: Response) {
    let { user, country, dateStart, dateEnd} = request.params
    ViewsProfile.getViewsProfileSearchByTime(dateStart,dateEnd).then(async (rankingPosts:any) => {
   

      if(rankingPosts.length >= 0){
        let ranking:any = await User.populate(rankingPosts, {path:"_id.user"});
        if (country != "null") {
          ranking = ranking.filter((item) => {
            return item._id.user.geo.country == country;
          });
        }
        let total = ranking.length;
      let myPosition =
        ranking.findIndex((item) => {
          return item._id.user._id == user;
        }) + 1;
        if (myPosition == 0) {
          myPosition = total + 1;
        }
        response.status(200).json({
          myPosition,
          total,
          ranking: ranking.slice(0, 3),
        });
 
    }
    });
  }

  public getViewsProfileReboundByTime(request: Request, response: Response) {
    let { user, country, dateStart, dateEnd} = request.params
    ViewsProfile.getViewsProfileReboundByTime(dateStart,dateEnd).then(async (rankingPosts:any) => {
   

      if(rankingPosts.length >= 0){
        let ranking:any = await User.populate(rankingPosts, {path:"_id.user"});
        if (country != "null") {
          ranking = ranking.filter((item) => {
            return item._id.user.geo.country == country;
          });
        }
        let total = ranking.length;
      let myPosition =
        ranking.findIndex((item) => {
          return item._id.user._id == user;
        }) + 1;
        if (myPosition == 0) {
          myPosition = total + 1;
        }
        response.status(200).json({
          myPosition,
          total,
          ranking: ranking.slice(0, 3),
        });
 
    }
    });
  }
}
