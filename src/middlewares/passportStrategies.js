import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import GitHubStrategy from 'passport-github2';
import { env } from '../configs/index.js';
import services from '../services/index.js';
import { dtos } from '../entities/index.js';
import { userValidator } from '../schemas/zod/index.js';
import { encryptPassword, isValidPassword } from '../utils/index.js';
import {
  InternalServerError,
  DuplicateResourceError,
  UnauthorizedError,
  ResourceNotFoundError,
} from '../customErrors/index.js';

function cookieJwtExtractor(req) {
  const token = req?.cookies?.token || null;
  req.requestLogger.debug(`JWT token: ${token}`);
  if (!token) {
    throw new UnauthorizedError('No token present');
  }
  return token;
}

export function passportStrategies() {
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieJwtExtractor]),
        secretOrKey: env.JWT_PRIVATE_KEY,
      },
      async (jwtPayload, done) => {
        try {
          return done(null, new dtos.UserDto(jwtPayload.user));
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, email, password, done) => {
        try {
          req.requestLogger.debug(`Role is: ${req.body.role}`);
          const { user: dbUser } = await services.users.getByEmail(email);
          if (dbUser) {
            return done(new DuplicateResourceError('User already exists'));
          }

          const reqUser = userValidator.parse(req.body);
          reqUser.password = encryptPassword(password);
          const { user } = await services.users.save(reqUser);
          return done(null, new dtos.UserDto(user));
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    'login',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        req.requestLogger.debug('Passport: login', {
          function: 'passport:login',
        });
        try {
          const { user } = await services.users.getByEmail(username);
          if (!user) return done(null, false);
          if (!isValidPassword(password, user.password)) {
            return done(new UnauthorizedError('Invalid credentials'));
          }
          // await services.users.updateLastConnection(username);
          return done(null, new dtos.UserDto(user));
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: 'Iv23liHfrzmE7rV1Bwuj',
        clientSecret: '27ca6825a2c98166ef9f8eef1a56ba64e90fa15c',
        callbackURL: '/api/v1/sessions/github',
      },
      async (_, __, profile, done) => {
        try {
          const { user } = await services.users.getByEmail(profile._json.email);
          if (user) {
            return done(null, new dtos.UserDto(user));
          }

          const newUser = userValidator
            .omit({ password: true }) // omits password field from parsed object to remove validations
            .passthrough() // allows unknown keys (password in this case, which was omitted)
            .parse({
              firstName: profile._json.name,
              email: profile._json.email,
            });
          const savedResponse = await services.users.save(newUser);

          return done(null, new dtos.UserDto(savedResponse));
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
      const { user } = await services.users.getByEmail(email);
      return done(
        null,
        user && {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      );
    } catch (error) {
      done(new InternalServerError(error));
    }
  });
}
