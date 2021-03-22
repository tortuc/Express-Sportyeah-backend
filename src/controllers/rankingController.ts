import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, response, Response } from "express";
import Like from "../models/like";
import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";

import * as moment from 'moment'

/**
 * RankingController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Sapviremoto
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
      let ranking = await Post.populate(rankingPosts, "_id");
      let rankingAndUsers = await User.populate(ranking, "_id.user");

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
    });
  }

  public getSharedPostRankingSinceEver(request: Request, response: Response) {
    let user = request.params.user;
    let country = request.params.country;
    Post.getPostAllTime().then(async (rankingPosts) => {
      let ranking = await Post.populate(rankingPosts, "_id");
      let rankingAndUsers = await User.populate(ranking, "_id.user");

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
    });
  }


  public getCommentsPostRankingSinceEver(request: Request, response: Response) {
    let user = request.params.user;
    let country = request.params.country;

    Comment.getCommentAllTime().then(async (rankingPosts) => {
      let ranking = await Post.populate(rankingPosts, "_id");
      let rankingAndUsers = await User.populate(ranking, "_id.user");

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
    });
  }

  // Dates
  public getReactionsPostRankingDays(request: Request, response: Response) {
    let user = request.params.user;
    let country = request.params.country;
    let dateStart = request.params.dateStart
    let dateEnd = request.params.dateEnd
    Like.getLikesByTime(dateStart,dateEnd).then(async (rankingPosts) => {
      let ranking = await Post.populate(rankingPosts, "_id");
      let rankingAndUsers = await User.populate(ranking, "_id.user");

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
    });
  }
  public getCommentsPostRankingDays(request: Request, response: Response) {
    let user = request.params.user;
    let country = request.params.country;
    let dateStart = request.params.dateStart
    let dateEnd = request.params.dateEnd

    Comment.getCommentByTime(dateStart,dateEnd).then(async (rankingPosts) => {
      let ranking = await Post.populate(rankingPosts, "_id");
      let rankingAndUsers = await User.populate(ranking, "_id.user");

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
    });
  }

  public getSharedPostRankigDays(request: Request, response: Response) {
    let user = request.params.user;
    let country = request.params.country;
    let dateStart = request.params.dateStart
    let dateEnd = request.params.dateEnd

    Post.getPostByTime(dateStart,dateEnd).then(async (rankingPosts) => {
      let ranking = await Post.populate(rankingPosts, "_id");
      let rankingAndUsers = await User.populate(ranking, "_id.user");

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
    });
  }
}
