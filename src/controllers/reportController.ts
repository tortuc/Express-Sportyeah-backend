import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import Report from "../models/report";
import { Alert } from "../helpers/alert";

import Comment from "../models/comment";

/**
 * ReportController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright Retail Servicios Externos SL
 */

export class ReportController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   *
   * Crear un reporte
   */
  public createReport(request: Request, response: Response) {
    const report = request.body;
    Report.newReport(report)
      .then((newReport) => {
        response.status(HttpResponse.Ok).json(newReport);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }

  /**
   *
   * Cerrar la denuncia, sin acciones
   */
  public closeOnly(request: Request, response: Response) {
    const { id } = request.params;
    const admin = request.body.decoded.id;
    Report.makeReportCloseWithoutActions(id)
      .then((report) => {
        const comment: any = report.comment;
        Report.deleteAllReportByComment(comment._id);
        Alert.reportCloseOnly(report, admin);
        response.status(HttpResponse.Ok).json(report);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }
  /**
   * Cerrar reporte o denuncia, y eliminar el comentario
   */
  public closeAndDelete(request: Request, response: Response) {
    const { id } = request.params;
    const admin = request.body.decoded.id;

    Report.makeReportCloseAndDeletedComment(id)
      .then(async (report) => {
        const comment: any = report.comment;
        await Comment.deleteComment(comment._id);

        Report.deleteAllReportByComment(comment._id);
        Alert.reportCloseAndDelete(report, admin);
        response.status(HttpResponse.Ok).json(report);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send(err);
      });
  }

  public getAllReports(request: Request, response: Response) {
    const skip = Number(request.params.skip);
    Report.getPendingReports(skip)
      .then((reports) => {
        response.status(HttpResponse.Ok).json(reports);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }
  public getOne(request: Request, response: Response) {
    const { id } = request.params;
    Report.getOneReport(id)
      .then((report) => {
        response.status(HttpResponse.Ok).json(report);
      })
      .catch((error) => {
        response.status(HttpResponse.BadRequest).send(error);
      });
  }
}
