import { BaseController } from "./baseController";
import { Config } from '../helpers/config';
import { Request, Response } from 'express';
import axios from 'axios';

enum Endpoints {
  SCORES = 'scores/live.json',
  PAST_MATCHES = 'scores/history.json',
  FIXTURES = 'fixtures/matches.json',
}

export class LivescoreController extends BaseController {

  constructor() { 
    super();
  }

  public async getScores(request: Request, response: Response) {
    const endpoint: string = this.buildUrl(Endpoints.SCORES); 
    const result: any = await axios.get(endpoint);
    response.send(result.data);
  }

  public async getPastMatches(request: Request, response: Response) { 
    const endpoint: string = this.buildUrl(Endpoints.PAST_MATCHES); 
    const result: any = await axios.get(endpoint);
    response.send(result.data);
  }

  public async getFixtures(request: Request, response: Response) { 
    const endpoint: string = this.buildUrl(Endpoints.FIXTURES); 
    const result: any = await axios.get(endpoint);
    response.send(result.data);
  }

  private buildUrl(endpoint: string): string {
    const apiUrl: string = Config.get('livescoreapi.url');;
    const apiKey: string = Config.get('livescoreapi.key');
    const apiSecret: string = Config.get('livescoreapi.secret');
    const keyPair: string = `?key=${ apiKey }&secret=${ apiSecret }`;
    return `${ apiUrl }/${ endpoint+keyPair }`;
  }

}