import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { respond } from '../utils/response';
import BaseController from './BaseController';
import Users from '../models/Users';

export default class UsersController extends BaseController {
  static basePath = '/api/v1/users';

  initialize() {
    // GET get Users list
    this.app.get(UsersController.basePath, UsersController.getAllUsers);

    // GET get Users by id
    this.app.get(
      `${UsersController.basePath}/:id`,
      UsersController.getUsersById
    );

    // Users create a new Users
    this.app.post(UsersController.basePath, UsersController.createUsers);

    // PUT update existing Users
    this.app.put(
      `${UsersController.basePath}/:id`,
      UsersController.updateUsers
    );

    // DELETE delete Users
    this.app.delete(
      `${UsersController.basePath}/:id`,
      UsersController.deleteUsers
    );
  }

  static mount(app) {
    return new UsersController(app);
  }

  // Start: Endpoints

  static async getAllUsers(req, res) {
    try {
      const users = await new Users().get();
      respond(res, OK, users);
    } catch (e) {
      UsersController.handleUnknownError(res, e);
    }
  }

  static async getUsersById(req, res) {
    try {
      const { id } = req.params;
      const users = await new Users(id).getByKey();

      if (!users) {
        respond(res, NOT_FOUND);
        return;
      }

      respond(res, OK, users);
    } catch (e) {
      UsersController.handleUnknownError(res, e);
    }
  }

  static async createUsers(req, res) {
    try {
      const expectedParams = [
        'ponyName',
        'ponyFirstLastName',
        'ponySeccondtLastName',
        'ponyRazetLastName',
        'ponyPassword'
      ];
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

      const {
        ponyName,
        ponyFirstLastName,
        ponySeccondtLastName,
        ponyRazetLastName,
        ponyPassword
      } = req.body;

      const users = Users.newUsers(
        ponyName,
        ponyFirstLastName,
        ponySeccondtLastName,
        ponyRazetLastName,
        ponyPassword
      );
      await users.create();

      respond(res, OK, users);
    } catch (e) {
      UsersController.handleUnknownError(res, e);
    }
  }

  static async updateUsers(req, res) {
    try {
      const { id } = req.params;

      const users = await new Users(id).getByKey();

      if (!users) {
        respond(res, NOT_FOUND);
        return;
      }

      const allowedParams = [
        'ponyName',
        'ponyFirstLastName',
        'ponySeccondtLastName',
        'ponyRazetLastName',
        'ponyPassword'
      ];

      Object.keys(req.body).forEach(p => {
        if (allowedParams.includes(p)) {
          users[p] = req.body[p];
        }
      });

      users.updatedAt = new Date();

      await users.update();

      respond(res, OK, users);
    } catch (e) {
      UsersController.handleUnknownError(e);
    }
  }

  static async deleteUsers(req, res) {
    try {
      const { id } = req.params;
      await new Users(id).delete();
      respond(res, OK);
    } catch (e) {
      UsersController.handleUnknownError(e);
    }
  }

  // End: Endpoints
}
