import express from 'express';
import roleFilter from '../helpers/roleFilter';
import tasksController from '../controllers/tasksController';
import userIdFilter from '../helpers/userIdFilter';

var tasksRouter = express.Router();

tasksRouter.get(
  '/tasks',
  roleFilter('admin', 'mentor'),
  tasksController.getTasks
);

tasksRouter.get(
  '/tasks?includeAssigned=true',
  roleFilter('admin', 'mentor'),
  tasksController.getTasksWithAssigned
);

tasksRouter.get(
  '/tasks?member=:userId',
  roleFilter('admin', 'member'),
  userIdFilter,
  tasksController.getMemberTasks
);

tasksRouter.get(
  '/tasks/:taskId/members',
  roleFilter('admin', 'mentor'),
  tasksController.getAssignedTo
);

tasksRouter.post(
  '/tasks',
  roleFilter('admin', 'mentor'),
  tasksController.addTask
);
tasksRouter.post(
  '/tasks/:taskId',
  roleFilter('admin', 'mentor'),
  tasksController.assignTask
);

tasksRouter.put(
  '/tasks/:taskId',
  roleFilter('admin', 'mentor'),
  tasksController.editTask
);

tasksRouter.put(
  '/tasks/:taskId/members',
  roleFilter('admin', 'mentor'),
  tasksController.unassignTask
);

tasksRouter.delete(
  '/tasks/:taskId',
  roleFilter('admin', 'mentor'),
  tasksController.deleteTask
);

progressRouter.get(
  '/tracks?member=:userId/progress',
  roleFilter('admin', 'mentor'),
  tasksController.getMemberProgress
);

export default tasksRouter;
