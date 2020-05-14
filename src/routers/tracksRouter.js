import express from 'express';
import roleFilter from '../helpers/roleFilter';
import tasksController from '../controllers/tasksController';
import userIdFilter from '../helpers/userIdFilter';

var tracksRouter = express.Router();

tracksRouter.get(
  '/member/:userId/tracks',
  roleFilter('member'),
  userIdFilter,
  tasksController.getMemberTracks
);

tracksRouter.post(
  '/member/:userId/tasks/:memberTaskId/track',
  roleFilter('member'),
  userIdFilter,
  tasksController.trackTask
);

tracksRouter.put(
  '/tracks/:id',
  roleFilter('member'),
  userIdFilter,
  tasksController.editTrack
);

tracksRouter.delete(
  '/tracks/:id',
  roleFilter('member'),
  userIdFilter,
  tasksController.deleteTrack
);

export default tracksRouter;
