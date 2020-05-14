import express from 'express';
import roleFilter from '../helpers/roleFilter';
import tasksController from '../controllers/tasksController';

var progressRouter = express.Router();

progressRouter.get(
  '/member/:userId/progress',
  roleFilter('admin', 'mentor'),
  tasksController.getMemberProgress
);

export default progressRouter;
