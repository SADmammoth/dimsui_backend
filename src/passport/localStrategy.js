import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from '../models/UserModel';

const localStrategy = new LocalStrategy(
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

      if (!user || !user.checkPassword(password)) {
        return done(null, false, {
          message: 'No such user or password is incorrect',
        });
      }

      return done(null, user);
    });
  }
);

export default localStrategy;
