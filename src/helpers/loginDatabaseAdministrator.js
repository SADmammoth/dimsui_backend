const StatusCodes = require('http-status-codes').StatusCodes;
const passport = require('passport');
const DATABASE_ADMIN = require('../helpers/roles').DATABASE_ADMIN;

module.exports = async function loginDatabaseAdministrator(req, res, next) {
  await passport.authenticate('local', function (err, user) {
    if (user == false || user.role === DATABASE_ADMIN) {
      res.status(StatusCodes.UNAUTHORIZED);
      res.send('Login failed');
    } else {
      next();
    }
  })(req, res, next);
};
