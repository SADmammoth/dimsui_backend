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

router.post('/login', async (req, res, next) => {
  await passport.authenticate('local', function (err, user, info) {
    if (user == false) {
      res.send('Login failed');
    } else {
      passport;

      const payload = {
        userId: user.userId,
        login: user.login,
      };
      const token = jwt.sign(payload, process.env.AUTH_SECRET);

      res.json({
        user: user.login,
        userId: user.userId,
        token: 'JWT ' + token,
      });
    }
  })(req, res, next);
});

router.get('/custom', async (req, res, next) => {
  await passport.authenticate('jwt', function (error, user) {
    console.log(user, error);
    if (user) {
      res.send(user.login + ' authorised');
    } else {
      res.send('No such user');
      console.log('err', error);
    }
  })(req, res, next);
});

export default router;
