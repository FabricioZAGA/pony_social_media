import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { respond } from '../utils/response';
import BaseController from './BaseController';
import Reply from '../models/PonyReply';

export default class ReplyPonyController extends BaseController {
  static basePath = '/api/v1/ponysReply';

  initialize() {
    // GET get Reply list
    this.app.get(ReplyPonyController.basePath, ReplyPonyController.getAllReply);

    // GET get Reply by id
    this.app.get(
      `${ReplyPonyController.basePath}/:id`,
      ReplyPonyController.getReplyById
    );

    // Reply create a new Reply
    this.app.post(
      ReplyPonyController.basePath,
      ReplyPonyController.createReply
    );

    // PUT update existing Reply
    this.app.put(
      `${ReplyPonyController.basePath}/:id`,
      ReplyPonyController.updateReply
    );

    // DELETE delete Reply
    this.app.delete(
      `${ReplyPonyController.basePath}/:id`,
      ReplyPonyController.deleteReply
    );
  }

  static mount(app) {
    return new ReplyPonyController(app);
  }

  // Start: Endpoints

  static async getAllReply(req, res) {
    try {
      const reply = await new Reply().get();
      respond(res, OK, reply);
    } catch (e) {
      ReplyPonyController.handleUnknownError(res, e);
    }
  }

  static async getReplyById(req, res) {
    try {
      const { id } = req.params;
      const reply = await new Reply(id).getByKey();

      if (!reply) {
        respond(res, NOT_FOUND);
        return;
      }

      respond(res, OK, reply);
    } catch (e) {
      ReplyPonyController.handleUnknownError(res, e);
    }
  }

  static async createReply(req, res) {
    try {
      const expectedParams = ['postId', 'parentId', 'author', 'content'];
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

      const { postId, parentId, author, content } = req.body;

      const reply = Reply.newPonysReply(postId, parentId, author, content);
      await reply.create();

      respond(res, OK, reply);
    } catch (e) {
      ReplyPonyController.handleUnknownError(res, e);
    }
  }

  static async updateReply(req, res) {
    try {
      const { id } = req.params;

      const reply = await new Reply(id).getByKey();

      if (!reply) {
        respond(res, NOT_FOUND);
        return;
      }

      const allowedParams = [
        'postId',
        'parentId',
        'author',
        'content',
        'likeCount'
      ];

      Object.keys(req.body).forEach(p => {
        if (allowedParams.includes(p)) {
          reply[p] = req.body[p];
        }
      });

      reply.updatedAt = new Date();

      await reply.update();

      respond(res, OK, reply);
    } catch (e) {
      ReplyPonyController.handleUnknownError(e);
    }
  }

  static async deleteReply(req, res) {
    try {
      const { id } = req.params;
      await new Reply(id).delete();
      respond(res, OK);
    } catch (e) {
      ReplyPonyController.handleUnknownError(e);
    }
  }

  // End: Endpoints
}
