import { Router } from 'express';
import apiControllers from '../../controllers/api/index.js';

const _sessionsRouter = Router();

const { sessions } = apiControllers;

_sessionsRouter.post('/', sessions.login);
_sessionsRouter.delete('/', sessions.logout);

export const sessionsRouter = {
  basePath: '/sessions',
  router: _sessionsRouter,
};
