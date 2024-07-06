export default class UsersService {
  #usersDao;

  constructor(usersDao) {
    this.#usersDao = usersDao;
  }

  async getUserByEmail(email, { throws = false } = {}) {
    return this.#usersDao.get({ email }, { throws });
  }

  async getUserById(id, { throws = false } = {}) {
    return this.#usersDao.get({ id }, { throws });
  }

  async get(filter, { throws = false } = {}) {
    return this.#usersDao.get(filter, { throws });
  }

  async save(request) {
    return this.#usersDao.save(request);
  }
}
