import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { respond } from '../utils/response';
import BaseController from './BaseController';
import PonyFriend from '../models/PonyFriend';

export default class PonyFriendsController extends BaseController {
  static basePath = '/api/v1/ponyfriendships';

  initialize() {
    this.app.get(PonyFriendsController.basePath, PonyFriendsController.getAllFriendships);

    this.app.get(`${PonyFriendsController.basePath}/:id`,PonyFriendsController.getFriendshipById);

    this.app.post(PonyFriendsController.basePath, PonyFriendsController.createNewFriendship);

    this.app.delete(`${PonyFriendsController.basePath}/:id`,PonyFriendsController.deleteFriendship);
  }

  static mount(app) {
    return new PonyFriendsController(app);
  }

  static async getAllFriendships(req, res) {
    try {
      const friendship = await new PonyFriend().get();
      respond(res, OK, friendship);
    } catch (e) {
      PonyFriendsController.handleUnknownError(res, e);
    }
  }

  static async getFriendshipById(req, res) {
    try {
      const { id } = req.params;
      const friendship = await new PonyFriend(id).getByKey();

      if (!friendship) {
        respond(res, NOT_FOUND);
        return;
      }

      respond(res, OK, friendship);
    } catch (e) {
      PonyFriendsController.handleUnknownError(res, e);
    }
  }

  static async createNewFriendship(req, res) {
    try {
      const expectedParams = ['friendOneId', 'friendTwoId'];
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

      const { friendOneId, friendTwoId } = req.body;

      const friendship = PonyFriend.newFriendship(friendOneId, friendTwoId);
      await friendship.create();

      respond(res, OK, friendship);
    } catch (e) {
      PonyFriendsController.handleUnknownError(res, e);
    }
  }


  static async deleteFriendship(req, res) {
    try {
      const { id } = req.params;
      await new PonyFriend(id).delete();
      respond(res, OK);
    } catch (e) {
      PonyFriendsController.handleUnknownError(e);
    }
  }
}
