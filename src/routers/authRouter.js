const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const StatusCodes = require('http-status-codes').StatusCodes;
const UserModel = require('../models/UserModel');
const passportInit = require('../passport/passportInit');
const loginDatabaseAdministrator = require('../helpers/loginDatabaseAdministrator');

var authRouter = express.Router();

passportInit();

authRouter.post('/users', loginDatabaseAdministrator, async (req, res) => {
  res.json(await UserModel.create(req.body.newUser));
});

authRouter.post('/users/login', async (req, res, next) => {
  await passport.authenticate('local', function (err, user) {
    if (user == false) {
      res.status(StatusCodes.UNAUTHORIZED);
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

module.exports = authRouter;
