import express from 'express';
import databaseInit from '../controllers/databaseInit';
import membersController from '../controllers/membersController';
import tasksController from '../controllers/tasksController';

var router = express.Router();

router.get('/directions', databaseInit.getDirections);
router.post('/directions', databaseInit.createDirections);
router.post('/states', databaseInit.createTaskStates);

const roleFilter = (...roles) => {
  return (req, res, next) => {
    const { user } = req;
    console.log(user.role, roles, !roles.includes(user.role));
    if (!roles.includes(user.role)) {
      res.status(401);
      res.send();
    }
    next();
  };
};

const userIdFilter = function (req, res, next) {
  if (req.user.role === 'member' && req.user.userId != req.params.userId) {
    console.log(0);
    res.status(401);
    res.send();
  }
  next();
};

router.get(
  '/members/profile',
  roleFilter('admin', 'mentor'),
  membersController.getMembers
);
router.post(
  '/members/profile',
  roleFilter('admin'),
  membersController.addMember
);
router.put(
  '/members/:id/profile',
  roleFilter('admin'),
  membersController.editMember
);
router.delete(
  '/members/:id',
  roleFilter('admin'),
  membersController.deleteMember
);

router.get(
  '/tasks?includeAssigned=true',
  roleFilter('admin', 'mentor'),
  tasksController.getTasksWithAssigned
);
router.get('/tasks/', roleFilter('admin', 'mentor'), tasksController.getTasks);
router.get(
  '/tasks/:id/assigned',
  roleFilter('admin', 'mentor'),
  tasksController.getAssigned
);
router.put(
  '/members/tasks/:taskId',
  roleFilter('admin', 'mentor'),
  tasksController.unassignTask
);
router.post('/tasks/', roleFilter('admin', 'mentor'), tasksController.addTask);
router.put(
  '/tasks/:id',
  roleFilter('admin', 'mentor'),
  tasksController.editTask
);
router.post(
  '/tasks/:taskId',
  roleFilter('admin', 'mentor'),
  tasksController.assignTask
);
router.get(
  '/members/:userId/tasks',
  roleFilter('admin', 'member'),
  userIdFilter,
  tasksController.getMemberTasks
);
router.delete(
  '/tasks/:id',
  roleFilter('admin', 'mentor'),
  tasksController.deleteTask
);

router.get(
  '/member/:userId/tracks',
  roleFilter('member'),
  userIdFilter,
  tasksController.getMemberTracks
);
router.post(
  '/member/:userId/tasks/:memberTaskId/track',
  roleFilter('member'),
  userIdFilter,
  tasksController.trackTask
);
router.put(
  '/tracks/:id',
  roleFilter('member'),
  userIdFilter,
  tasksController.editTrack
);
router.delete(
  '/tracks/:id',
  roleFilter('member'),
  userIdFilter,
  tasksController.deleteTrack
);

router.get(
  '/member/:userId/progress',
  roleFilter('admin', 'mentor'),
  tasksController.getMemberProgress
);

export default router;
