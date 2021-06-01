import { LivescoreController } from '../controllers/livescoreController';

const livescoreController = new LivescoreController();

const LivescoreRouter: any = livescoreController.router();

LivescoreRouter.get('/scores',  livescoreController.getScores.bind(livescoreController));
LivescoreRouter.get('/past-matches', livescoreController.getPastMatches.bind(livescoreController));
LivescoreRouter.get('/fixtures', livescoreController.getFixtures.bind(livescoreController));
LivescoreRouter.get('/events/:id', livescoreController.getMatchEvents.bind(livescoreController));
LivescoreRouter.get('/standings/competition/:id', livescoreController.getCompetitionStandings.bind(livescoreController));
LivescoreRouter.get('/statistic/:id', livescoreController.getStatistic.bind(livescoreController));

module.exports = LivescoreRouter;