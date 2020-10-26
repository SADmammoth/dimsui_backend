const { StatusCodes } = require('http-status-codes');

module.exports = function responseIfModified(
  databaseResponse,
  expressResponse
) {
  if (!databaseResponse.nModified && databaseResponse) {
    expressResponse.send();
    return;
  }
  if (databaseResponse.nModified > 0) {
    expressResponse.send();
  } else {
    expressResponse.status(StatusCodes.BAD_REQUEST);
    expressResponse.send();
  }
};
