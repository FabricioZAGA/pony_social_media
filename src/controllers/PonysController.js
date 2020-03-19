import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { respond } from '../utils/response';
import BaseController from './BaseController';
// import Post from '../models/Ponys';
import Ponys from '../models/Ponys';

export default class PonysController extends BaseController {
  static basePath = '/api/v1/ponys';

  initialize() {
    this.app.get(PonysController.basePath, PonysController.getAllPonys);

    this.app.get(
      `${PonysController.basePath}/:id_authorpony`,
      PonysController.getPonysById
    );

    this.app.post(PonysController.basePath, PonysController.createPonys);

    this.app.put(
      `${PonysController.basePath}/:id_authorpony`,
      PonysController.updatePonys
    );

    this.app.delete(
      `${PonysController.basePath}/:id_authorpony`,
      PonysController.deletePonys
    );
  }

  static mount(app) {
    return new PonysController(app);
  }

  // Start: Endpoints

  static async getAllPonys(req, res) {
    try {
      const ponys = await new Ponys().get();
      respond(res, OK, ponys);
    } catch (e) {
      PonysController.handleUnknownError(res, e);
    }
  }

  static async getPonysById(req, res) {
    try {
      // eslint-disable-next-line camelcase
      const { id_authorpony } = req.params;
      const pony = await new Ponys(id_authorpony).getByKey();

      if (!pony) {
        respond(res, NOT_FOUND);
        return;
      }

      respond(res, OK, pony);
    } catch (e) {
      PonysController.handleUnknownError(res, e);
    }
  }

  static async createPonys(req, res) {
    try {
      const expectedParams = ['authorpony', 'title', 'content'];
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

      const { authorpony, title, content } = req.body;

      const pony = Ponys.newPost(authorpony, title, content);
      await pony.create();

      respond(res, OK, pony);
    } catch (e) {
      PonysController.handleUnknownError(res, e);
    }
  }

  static async updatePonys(req, res) {
    try {
      // eslint-disable-next-line camelcase
      const { id_authorpony } = req.params;

      const pony = await new Ponys(id_authorpony).getByKey();

      if (!pony) {
        respond(res, NOT_FOUND);
        return;
      }

      const allowedParams = ['id_authorpony', 'title', 'content', 'likeCount'];

      Object.keys(req.body).forEach(p => {
        if (allowedParams.includes(p)) {
          pony[p] = req.body[p];
        }
      });

      pony.updatedAt = new Date();

      await pony.update();

      respond(res, OK, pony);
    } catch (e) {
      PonysController.handleUnknownError(e);
    }
  }

  static async deletePonys(req, res) {
    try {
      // eslint-disable-next-line camelcase
      const { id_authorpony } = req.params;
      await new Ponys(id_authorpony).delete();
      respond(res, OK);
    } catch (e) {
      PonysController.handleUnknownError(e);
    }
  }

  // End: Endpoints
}
