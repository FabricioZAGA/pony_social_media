import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import FilesController from './controllers/FilesController';
import PonyFriendsController from './controllers/PonyFriendsController'
import PonyPicturesController from './controllers/PonyPicturesController'
import PonyRepliesController from './controllers/PonyRepliesController'
import PonysController from './controllers/PonysController'
import UsersController from './controllers/UsersController'

const app = express();
app.use(cors());
app.use(bodyParser.json());

UsersController.mount(app);
FilesController.mount(app);
PonyFriendsController.mount(app);
PonyPicturesController.mount(app);
PonyRepliesController.mount(app);
PonysController.mount(app);
export default app;
