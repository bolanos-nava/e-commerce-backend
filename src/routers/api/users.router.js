import { Router } from 'express';
import apiControllers from '../../controllers/api/index.js';

const _usersRouter = Router();

const { users } = apiControllers;

_usersRouter.post('/', users.createUser);

export const usersRouter = {
  basePath: '/users',
  router: _usersRouter,
};
