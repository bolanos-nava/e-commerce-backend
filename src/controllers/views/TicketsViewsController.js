import BaseViewsController from './BaseViewsController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').ServicesType['users']} UsersService
 */

export default class TicketsViewsController extends BaseViewsController {
  /**
   * Renders the users view
   *
   * @type {ExpressType['RequestHandler']}
   */
  renderSuccessView(req, res) {
    res.render('ticketSuccess', {
      ...this.getBaseContext(req),
      ticket: {
        _id: req.params.ticketId,
      },
    });
  }
}
