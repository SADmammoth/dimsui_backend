import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../src/models/UserModel';

var params = {};
params.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
params.secretOrKey = process.env.AUTH_SECRET;

const jwtStrategy = new JwtStrategy(params, (payload, done) => {
  UserModel.findOne({ userId: payload.userId })
    .then((user = null) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

export default jwtStrategy;
