const express = require('express');
const roleFilter = require('../helpers/roleFilter');
const tasksController = require('../controllers/tasksController');
const ADMIN = require('../helpers/roles').ADMIN;
const MENTOR = require('../helpers/roles').MENTOR;
const MEMBER = require('../helpers/roles').MEMBER;

var tasksRouter = express.Router();

tasksRouter.get(
  '/tasks',
  roleFilter(ADMIN, MENTOR, MEMBER),
  tasksController.getTasks
);

tasksRouter.get(
  '/tasks/:taskId/members',
  roleFilter(ADMIN, MENTOR),
  tasksController.getAssigned
);

tasksRouter.post('/tasks', roleFilter(ADMIN, MENTOR), tasksController.addTask);

tasksRouter.post(
  '/tasks/:taskId/members',
  roleFilter(ADMIN, MENTOR),
  tasksController.assignTask
);

tasksRouter.put(
  '/tasks/:taskId',
  roleFilter(ADMIN, MENTOR),
  tasksController.editTask
);

tasksRouter.put(
  '/tasks/states/:taskId',
  roleFilter(ADMIN, MENTOR),
  tasksController.setMemberTaskState
);

tasksRouter.put(
  '/tasks/:taskId/members',
  roleFilter(ADMIN, MENTOR),
  tasksController.unassignTask
);

tasksRouter.delete(
  '/tasks/:taskId',
  roleFilter(ADMIN, MENTOR),
  tasksController.deleteTask
);

module.exports = tasksRouter;
