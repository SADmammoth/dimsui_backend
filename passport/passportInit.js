import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from '../src/models/UserModel';
import jwtStrategy from './jwtStrategy';

export default function passportInit() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'login',
        passwordField: 'password',
        session: false,
      },
      function (login, password, done) {
        UserModel.findOne({ login }, (err, user) => {
          if (err) {
            return done(err);
          }
          console.log(user);
          if (!user || !user.checkPassword(password)) {
            return done(null, false, {
              message: 'No such user or password is incorrect',
            });
          }
          return done(null, user);
        });
      }
    )
  );

  passport.use(jwtStrategy);
}
