import passport from 'passport';
import jwtStrategy from './jwtStrategy';
import localStrategy from './localStrategy';

export default function passportInit() {
  passport.use(localStrategy);
  passport.use(jwtStrategy);
}
