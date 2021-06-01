import { BaseController } from "./baseController";
import { Config } from '../helpers/config';
import { Request, Response } from 'express';
import axios from 'axios';

enum Endpoints {
  SCORES = 'scores/live.json',
  PAST_MATCHES = 'scores/history.json',
  FIXTURES = 'fixtures/matches.json',
  EVENTS = 'scores/events.json',
  STANDINGS = 'leagues/table.json',
  STATISTIC = 'matches/stats.json',
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

  public async getMatchEvents(request: Request, response: Response) { 
    const eventId: string = request.params.id;
    const endpoint: string = this.buildUrl(Endpoints.EVENTS);
    const result: any = await axios.get(`${ endpoint }&id=${ eventId }`);
    response.send(result.data);
  }  

  public async getCompetitionStandings(request: Request, response: Response) { 
    const competitionId: string = request.params.id;
    const endpoint: string = this.buildUrl(Endpoints.STANDINGS); 
    const result: any = await axios.get(`${ endpoint }&competition_id=${ competitionId }`);
    response.send(result.data);
  }

  public async getStatistic(request: Request, response: Response) { 
    const matchId: string = request.params.id;
    const endpoint: string = this.buildUrl(Endpoints.STATISTIC); 
    const result: any = await axios.get(`${ endpoint }&match_id=${ matchId }`);
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