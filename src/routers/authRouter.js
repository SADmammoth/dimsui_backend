import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';
import passportInit from '../passport/passportInit';

var authRouter = express.Router();

passportInit();

authRouter.post('/users', async (req, res) => {
  res.json(await UserModel.create(req.body));
});

authRouter.post('/users/login', async (req, res, next) => {
  await passport.authenticate('local', function (err, user) {
    if (user == false) {
      res.send('Login failed');
    } else {
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

authRouter.get(
  '/echo',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    res.json({ userId: req.user.userId, role: req.user.role });
  }
);

export default authRouter;
