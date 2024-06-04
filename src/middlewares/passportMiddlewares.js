import passport from 'passport';
import passportLocal from 'passport-local';
import services from '../services/index.js';
import { userValidator } from '../schemas/zod/index.js';
import { encryptPassword, isValidPassword } from '../utils/index.js';
import { ResourceNotFoundError } from '../customErrors/ResourceNotFoundError.js';
import { UnauthorizedError } from '../customErrors/UnauthorizedError.js';

const { Strategy: LocalStrategy } = passportLocal;

export function passportMiddlewares() {
  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        try {
          const dbUser = await services.users.getUserByEmail(username);
          if (dbUser)
            return done(null, false, { message: 'User already exists' });

          const reqUser = userValidator.parse(req.body);
          reqUser.password = encryptPassword(password);
          const response = await services.users.saveNewUser(reqUser);
          return done(null, response);
        } catch (error) {
          return done(`Error ${error}`);
        }
      },
    ),
  );

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await services.users.getUserByEmail(username);
          if (!user) {
            return done(new ResourceNotFoundError('User not found'));
          }
          if (!isValidPassword(password, user.password)) {
            return done(new UnauthorizedError('Incorrect password'));
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await services.users.getUserById(id);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  });
}
