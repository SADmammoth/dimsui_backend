const express = require('express');
const roleFilter = require('../helpers/roleFilter');
const tasksController = require('../controllers/tasksController');
const userIdFilter = require('../helpers/userIdFilter');
const ADMIN = require('../helpers/roles').ADMIN;
const MENTOR = require('../helpers/roles').MENTOR;
const MEMBER = require('../helpers/roles').MEMBER;

var tracksRouter = express.Router();

tracksRouter.get(
  '/tracks',
  roleFilter(MEMBER),
  userIdFilter,
  tasksController.getMemberTracks
);

tracksRouter.post(
  '/tracks',
  roleFilter(MEMBER),
  userIdFilter,
  tasksController.trackTask
);

tracksRouter.get(
  '/tracks/progress',
  roleFilter(ADMIN, MENTOR),
  tasksController.getMemberProgress
);

tracksRouter.put(
  '/tracks/:id',
  roleFilter(MEMBER),
  userIdFilter,
  tasksController.editTrack
);

tracksRouter.delete(
  '/tracks/:id',
  roleFilter(MEMBER),
  userIdFilter,
  tasksController.deleteTrack
);

module.exports = tracksRouter;
