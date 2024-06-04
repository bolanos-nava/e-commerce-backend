import passport from 'passport';
import passportLocal from 'passport-local';
import services from '../services/index.js';
import { userValidator } from '../schemas/zod/index.js';
import { encryptPassword, isValidPassword } from '../utils/index.js';
import {
  InternalServerError,
  DuplicateResourceError,
} from '../customErrors/index.js';
import { User } from '../daos/models/User.js';

const { Strategy: LocalStrategy } = passportLocal;

export function passportMiddlewares() {
  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        try {
          const dbUser = await services.users.getUserByEmail(username);
          if (dbUser) {
            return done(new DuplicateResourceError('User already exists'));
          }

          const reqUser = userValidator.parse(req.body);
          reqUser.password = encryptPassword(password);
          const response = await services.users.saveNewUser(reqUser);
          return done(null, response);
        } catch (error) {
          return done(error);
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
          if (!user || !isValidPassword(password, user.password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email, done) => {
    try {
      const user = await services.users.getUserByEmail(email);
      return done(null, {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      done(new InternalServerError(error));
    }
  });
}
