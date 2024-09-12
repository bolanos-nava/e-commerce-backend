import BaseController from './BaseController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').ServicesType['users']} UsersServiceType
 */

const TEMPLATE_USERS_INACTIVE = `
  <h2
    style="
      padding-bottom: 0.2em;
      margin-bottom: 1em;
      border-bottom: 0.1em solid black;
    "
  >
    CoderStore
  </h2>

  <p>Hola {{to_name}},</p>

  <p>
    Tu cuenta ha sido eliminada debido a que no tuviste actividad por 30 días.
  </p>

  <p>
    Atentamente,
    <br />
    <em>CoderStore Communications Team</em>
  </p>
`;

const TEMPLATE_USER_DELETED = `
  <h2
    style="
      padding-bottom: 0.2em;
      margin-bottom: 1em;
      border-bottom: 0.1em solid black;
    "
  >
    CoderStore
  </h2>

  <p>Hola {{to_name}},</p>

  <p>
    Tu cuenta ha sido eliminada por un administrador.
  </p>

  <p>
    Atentamente,
    <br />
    <em>CoderStore Communications Team</em>
  </p>
`;

export default class UsersController extends BaseController {
  /** @type UsersServiceType */
  #usersService;

  /**
   * Constructs a new users controller
   *
   * @param {UsersServiceType} usersService - Users service instance
   */
  constructor(usersService) {
    super();
    this.#usersService = usersService;
  }

  /**
   * Endpoint that executes after creating a user with Passport
   *
   * @type {ExpressType['RequestHandler']}
   */
  create(_, res, __) {
    res.status(201).json({ status: 'created' });
  }

  /**
   * Endpoint to delete a user
   *
   * @type {ExpressType['RequestHandler']}
   */
  async delete(req, res, next) {
    try {
      const { userId } = req.params;
      this.validateIds({ userId });
      const userDeleted = await this.#usersService.delete(userId);
      console.log(userDeleted);

      const templateFull = TEMPLATE_USER_DELETED.replace(
        '{{to_name}}',
        userDeleted.firstName,
      );

      req.transport.sendMail({
        from: `CoderStore Communications <noreply@coderstore.com>`,
        to: userDeleted.email,
        subject: 'Tu cuenta ha sido eliminada',
        html: templateFull,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint to delete inactive users
   *
   * @type {ExpressType['RequestHandler']}
   */
  async deleteInactiveUsers(req, res, next) {
    try {
      // const numMilliseconds = 1000 * 60 * 60 * 24 * 2;
      const numMilliseconds = 1000 * 5; // 10 seconds
      const usersDeletedResponse =
        await this.#usersService.deleteInactiveUsers(numMilliseconds);
      req.requestLogger.http(
        `Deleted ${usersDeletedResponse.length} inactive users.`,
      );

      usersDeletedResponse.forEach((user) => {
        const templateFull = TEMPLATE_USERS_INACTIVE.replace(
          '{{to_name}}',
          user.firstName,
        );
        req.transport.sendMail({
          from: `CoderStore Communications <noreply@coderstore.com>`,
          to: user.email,
          subject: 'Tu cuenta ha sido eliminada',
          html: templateFull,
        });
      });

      res.status(200).send({
        status: 'success',
        payload: {
          numUsersDeleted: usersDeletedResponse.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint to get all users
   *
   * @type {ExpressType['RequestHandler']}
   */
  async list(_, res, next) {
    try {
      const users = await this.#usersService.getAll();
      res.json({ status: 'success', payload: users });
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const { userId } = req.params;
      this.validateIds({ userId });

      const user = await this.#usersService.get({ _id: userId });
      res.json({ status: 'success', payload: user });
    } catch (error) {
      next(error);
    }
  }
}
