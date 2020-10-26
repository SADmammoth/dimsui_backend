const express = require('express');
const databaseInit = require('../controllers/databaseInit');
const membersRouter = require('./membersRouter');
const tasksRouter = require('./tasksRouter');
const tracksRouter = require('./tracksRouter');
const loginDatabaseAdministrator = require('../helpers/loginDatabaseAdministrator');

var apiRouter = express.Router();

apiRouter.get('/directions', databaseInit.getDirections);

apiRouter.post(
  '/directions',
  loginDatabaseAdministrator,
  databaseInit.createDirections
);
apiRouter.post(
  '/states',
  loginDatabaseAdministrator,
  databaseInit.createTaskStates
);

apiRouter.use(membersRouter);
apiRouter.use(tasksRouter);
apiRouter.use(tracksRouter);

module.exports = apiRouter;
