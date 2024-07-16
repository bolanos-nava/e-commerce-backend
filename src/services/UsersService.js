export default class UsersService {
  #usersDao;

  constructor(usersDao) {
    this.#usersDao = usersDao;
  }

  async getByEmail(email, { throws = false } = {}) {
    return this.#usersDao.get({ email }, { throws });
  }

  async getById(id, { throws = false } = {}) {
    return this.#usersDao.get({ _id: id }, { throws });
  }

  async get(filter, { throws = false } = {}) {
    return this.#usersDao.get(filter, { throws });
  }

  async save(request) {
    return this.#usersDao.save(request);
  }
}
