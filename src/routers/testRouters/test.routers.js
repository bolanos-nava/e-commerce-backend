import { Router } from 'express';
import { mockRouter } from './mock.router.js';
import { logsRouter } from './logs.router.js';

export const testRouter = Router();

testRouter.use('/mock', mockRouter);
testRouter.use('/logs', logsRouter);
