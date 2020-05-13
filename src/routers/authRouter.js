import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';
import passportInit from '../../passport/passportInit';

var router = express.Router();

passportInit();

router.post('/users', async (req, res) => {
  res.json(await UserModel.create(req.body));
});

router.post('/users/login', async (req, res, next) => {
  await passport.authenticate('local', function (err, user, info) {
    if (user == false) {
      res.send('Login failed');
    } else {
      passport;

      const payload = {
        userId: user.userId,
        role: user.role,
        login: user.login,
      };
      const token = jwt.sign(payload, process.env.AUTH_SECRET);

      res.json({
        userId: user.userId,
        role: user.role,
        login: user.login,
        token: 'JWT ' + token,
      });
    }
  })(req, res, next);
});

router.get('/echo', passport.authenticate('jwt', { session: false }), function (
  req,
  res
) {
  res.json({ userId: req.user.userId, role: req.user.role });
});

export default router;
