import { Router } from 'express';

export const logsRouter = Router();

logsRouter.get('/', (req, res) => {
  req.logger.fatal('Fatal log');
  req.logger.error('Error log');
  req.logger.warning('Warning log');
  req.logger.info('Info log');
  req.logger.http('HTTP request');
  req.logger.debug('Debug log');
  res.send('Sent logs to console');
});
