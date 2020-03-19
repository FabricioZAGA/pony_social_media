import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { respond } from '../utils/response';
import BaseController from './BaseController';
import Match from '../models/Match';

export default class MatchController extends BaseController {
  static basePath = '/api/v1/match';

  initialize() {
    // GET get Match list
    this.app.get(MatchController.basePath, MatchController.getAllMatch);

    // GET get Match by id
    this.app.get(
      `${MatchController.basePath}/:id`,
      MatchController.getMatchById
    );

    // Match create a new Match
    this.app.post(MatchController.basePath, MatchController.createMatch);

    // PUT update existing Match
    this.app.put(
      `${MatchController.basePath}/:id`,
      MatchController.updateMatch
    );

    // DELETE delete Match
    this.app.delete(
      `${MatchController.basePath}/:id`,
      MatchController.deleteMatch
    );
  }

  static mount(app) {
    return new MatchController(app);
  }

  // Start: Endpoints

  static async getAllMatch(req, res) {
    try {
      const match = await new Match().get();
      respond(res, OK, match);
    } catch (e) {
      MatchController.handleUnknownError(res, e);
    }
  }

  static async getMatchById(req, res) {
    try {
      const { id } = req.params;
      const match = await new Match(id).getByKey();

      if (!match) {
        respond(res, NOT_FOUND);
        return;
      }

      respond(res, OK, match);
    } catch (e) {
      MatchController.handleUnknownError(res, e);
    }
  }

  static async createMatch(req, res) {
    try {
      const expectedParams = ['userId', 'secondUserId'];
      const validationErrors = [];

      expectedParams.forEach(p => {
        if (!req.body[p]) {
          validationErrors.push(`${p} parameter was not found in the request`);
        }
      });

      if (validationErrors.length > 0) {
        respond(res, BAD_REQUEST, {
          message: validationErrors.join('\n')
        });
        return;
      }

      const { userId, secondUserId } = req.body;

      const match = Match.newMatch(userId, secondUserId);
      await match.create();

      respond(res, OK, match);
    } catch (e) {
      MatchController.handleUnknownError(res, e);
    }
  }

  static async updateMatch(req, res) {
    try {
      const { id } = req.params;

      const match = await new Match(id).getByKey();

      if (!match) {
        respond(res, NOT_FOUND);
        return;
      }

      const allowedParams = ['userId', 'secondUserId', 'Accept'];

      Object.keys(req.body).forEach(p => {
        if (allowedParams.includes(p)) {
          match[p] = req.body[p];
        }
      });

      match.updatedAt = new Date();

      await match.update();

      respond(res, OK, match);
    } catch (e) {
      MatchController.handleUnknownError(e);
    }
  }

  static async deleteMatch(req, res) {
    try {
      const { id } = req.params;
      await new Match(id).delete();
      respond(res, OK);
    } catch (e) {
      MatchController.handleUnknownError(e);
    }
  }

  // End: Endpoints
}
