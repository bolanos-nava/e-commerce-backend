import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import GitHubStrategy from 'passport-github2';
import { env } from '../configs/index.js';
import repository from '../services/repository.js';
import { userValidator } from '../schemas/zod/index.js';
import { encryptPassword, isValidPassword } from '../utils/index.js';
import {
  InternalServerError,
  DuplicateResourceError,
  UnauthorizedError,
} from '../customErrors/index.js';

function cookieJwtExtractor(req) {
  console.log('token in cookie extractor', req?.cookies?.token);
  const token = req?.cookies?.token || null;
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
        console.log('jwt payload', jwtPayload);
        try {
          return done(null, jwtPayload);
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
      async (req, username, password, done) => {
        try {
          const dbUser = await repository.users.getUserByEmail(username);
          if (dbUser) {
            return done(new DuplicateResourceError('User already exists'));
          }

          const reqUser = userValidator.parse(req.body);
          reqUser.password = encryptPassword(password);
          const savedResponse = await repository.users.saveNewUser(reqUser);
          return done(null, savedResponse);
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
          const user = await repository.users.getUserByEmail(username);
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

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: 'Iv23liHfrzmE7rV1Bwuj',
        clientSecret: '27ca6825a2c98166ef9f8eef1a56ba64e90fa15c',
        callbackURL: 'http://localhost:8080/api/v1/sessions/github',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('profile', profile);
        try {
          const user = await repository.users.getUserByEmail(
            profile._json.email,
          );
          const briefedUser = (u) => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            role: u.role,
          });
          if (user) {
            return done(null, briefedUser(user));
          }

          const newUser = userValidator
            .omit({ password: true }) // omits password field from parsed object to remove validations
            .passthrough() // allows unknown keys (password in this case, which was omitted)
            .parse({
              firstName: profile._json.name,
              email: profile._json.email,
            });
          const savedResponse = await repository.users.saveNewUser(newUser);

          return done(null, briefedUser(savedResponse));
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
      const user = await repository.users.getUserByEmail(email);
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
      // TODO: when a user is deleted
      done(new InternalServerError(error));
    }
  });
}
