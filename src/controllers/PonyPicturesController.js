import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { respond } from '../utils/response';
import BaseController from './BaseController';
import PonyPicture from '../models/PonyPicture';

export default class PonyPicturesController extends BaseController {
  static basePath = '/api/v1/ponypictures';

  initialize() {
    this.app.get(PonyPicturesController.basePath, PonyPicturesController.getAllPictures);

    this.app.get(`${PonyPicturesController.basePath}/:id`,PonyPicturesController.getPictureById);

    this.app.post(PonyPicturesController.basePath, PonyPicturesController.createPonyImage);

    this.app.put(`${PonyPicturesController.basePath}/:id`, PonyPicturesController.updatePony);

    this.app.delete(`${PonyPicturesController.basePath}/:id`,PonyPicturesController.deletePicture);
  }

  static mount(app) {
    return new PonyPicturesController(app);
  }

  static async getAllPictures(req, res) {
    try {
      const pictures = await new PonyPicture().get();
      respond(res, OK, pictures);
    } catch (e) {
      PonyPicturesController.handleUnknownError(res, e);
    }
  }

  static async getPictureById(req, res) {
    try {
      const { id } = req.params;
      const picture = await new PonyPicture(id).getByKey();

      if (!picture) {
        respond(res, NOT_FOUND);
        return;
      }

      respond(res, OK, picture);
    } catch (e) {
      PonyPicturesController.handleUnknownError(res, e);
    }
  }

  static async createPonyImage(req, res) {
    try {
      const expectedParams = ['ponyId', 'imageUrl'];
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

      const { ponyId, imageUrl } = req.body;

      const newImage = PonyPicture.newImage(ponyId, imageUrl);
      await newImage.create();

      respond(res, OK, newImage);
    } catch (e) {
      PonyPicturesController.handleUnknownError(res, e);
    }
  }

  static async updatePony(req, res) {
    try {
      const { id } = req.params;

      const picture = await new PonyPicture(id).getByKey();

      if (!picture) {
        respond(res, NOT_FOUND);
        return;
      }

      const allowedParams = ['imageUrl'];

      Object.keys(req.body).forEach(p => {
        if (allowedParams.includes(p)) {
          picture[p] = req.body[p];
        }
      });

      picture.updatedAt = new Date();

      await picture.update();

      respond(res, OK, picture);
    } catch (e) {
      PonyPicturesController.handleUnknownError(e);
    }
  }

  static async deletePicture(req, res) {
    try {
      const { id } = req.params;
      await new PonyPicture(id).delete();
      respond(res, OK);
    } catch (e) {
      PonyPicturesController.handleUnknownError(e);
    }
  }
}
