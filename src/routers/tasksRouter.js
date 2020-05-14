import express from 'express';
import roleFilter from '../helpers/roleFilter';
import tasksController from '../controllers/tasksController';
import userIdFilter from '../helpers/userIdFilter';

var tasksRouter = express.Router();

tasksRouter.get(
  '/tasks?includeAssigned=true',
  roleFilter('admin', 'mentor'),
  tasksController.getTasksWithAssigned
);

tasksRouter.get(
  '/tasks/',
  roleFilter('admin', 'mentor'),
  tasksController.getTasks
);

tasksRouter.get(
  '/tasks/:id/assigned',
  roleFilter('admin', 'mentor'),
  tasksController.getAssigned
);

tasksRouter.put(
  '/members/tasks/:taskId',
  roleFilter('admin', 'mentor'),
  tasksController.unassignTask
);

tasksRouter.post(
  '/tasks/',
  roleFilter('admin', 'mentor'),
  tasksController.addTask
);

tasksRouter.put(
  '/tasks/:id',
  roleFilter('admin', 'mentor'),
  tasksController.editTask
);

tasksRouter.post(
  '/tasks/:taskId',
  roleFilter('admin', 'mentor'),
  tasksController.assignTask
);

tasksRouter.get(
  '/members/:userId/tasks',
  roleFilter('admin', 'member'),
  userIdFilter,
  tasksController.getMemberTasks
);

tasksRouter.delete(
  '/tasks/:id',
  roleFilter('admin', 'mentor'),
  tasksController.deleteTask
);

export default tasksRouter;
