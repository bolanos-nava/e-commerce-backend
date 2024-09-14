import os from 'node:os';

/**
 * Class with common methods for the other views controllers
 */
export default class BaseViewsController {
  getBaseContext(req) {
    return {
      hostname: os.hostname(),
      isAdmin: req?.user?.role === 'admin',
      isLogged: Boolean(req.cookies.token),
    };
  }
}
