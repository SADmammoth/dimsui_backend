import express from 'express';
import roleFilter from '../helpers/roleFilter';
import tasksController from '../controllers/tasksController';
import userIdFilter from '../helpers/userIdFilter';

var tracksRouter = express.Router();

tracksRouter.get(
  '/tracks?member=:userId',
  roleFilter('member'),
  userIdFilter,
  tasksController.getMemberTracks
);

progressRouter.get(
  '/tracks?member=:userId/progress',
  roleFilter('admin', 'mentor'),
  tasksController.getMemberProgress
);

tracksRouter.post(
  '/tracks?member=:userId&task=:memberTaskId',
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
