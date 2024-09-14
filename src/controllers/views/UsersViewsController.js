import BaseViewsController from './BaseViewsController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
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

  /**
   * Renders the users view
   *
   * @type {ExpressType['RequestHandler']}
   */
  async renderUsersView(req, res, next) {
    try {
      const { users } = await this.#usersService.getAll();
      res.render('users', {
        ...this.getBaseContext(req),
        users,
        title: 'Tienda | Usuarios',
        stylesheet: '/static/css/index.css',
        pageHeader: 'Usuarios',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Renders view to edit a user
   *
   * @type {ExpressType['RequestHandler']}
   */
  async renderUserEditView(req, res, next) {
    try {
      const { user } = await this.#usersService.dtoWrapper(() =>
        this.#usersService.getById(req.params.userId, { throws: true }),
      );
      req.requestLogger.debug(user);

      res.render('userEdit', {
        ...this.getBaseContext(req),
        user,
        title: 'Tienda | Editar Usuario',
        stylesheet: '/static/css/index.css',
        pageHeader: 'Editar Usuario',
      });
    } catch (error) {
      next(error);
    }
  }
}
