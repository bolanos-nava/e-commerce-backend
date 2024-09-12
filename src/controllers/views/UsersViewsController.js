import BaseViewsController from './BaseViewsController.js';

/**
 * @typedef {import('../../types').ServicesType['users']} UsersService
 */

export default class UsersViewsController extends BaseViewsController {
  /** @type UsersService */
  #usersService;

  /**
   * Constructs a new controller for users views
   *
   * @param {UsersService} usersService
   */
  constructor(usersService) {
    super();
    this.#usersService = usersService;
  }

  async renderUsersView(_, res, next) {
    const response = await this.#usersService.getAll();
    try {
      res.render('users', {
        users: response.users,
        title: 'Tienda | Usuarios',
        stylesheet: '/static/css/index.css',
        pageHeader: 'Usuarios',
      });
    } catch (error) {
      next(error);
    }
  }
}
