const roles = require('./roles');
const StatusCodes = require('http-status-codes').StatusCodes;

module.exports = function userIdFilter(req, res, next) {
  if (req.user.role === roles.MEMBER && req.user.userId != req.query.member) {
    res.status(StatusCodes.UNAUTHORIZED).send();
  }

  next();
};
