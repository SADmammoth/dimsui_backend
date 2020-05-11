import express from 'express';
import membersController from '../controllers/membersController';
import databaseInit from '../controllers/databaseInit';
import tasksController from '../controllers/tasksController';

var router = express.Router();

router.get('/directions', databaseInit.getDirections);
router.post('/directions', databaseInit.createDirections);
router.post('/states', databaseInit.createTaskStates);

router.get('/members/profile', membersController.getMembers);
router.post('/members/profile', membersController.addMember);
router.put('/members/:id/profile', membersController.editMember);
router.delete('/members/:id', membersController.deleteMember);

router.get('/tasks?includeAssigned=true', tasksController.getTasksWithAssigned);
router.get('/tasks/', tasksController.getTasks);
router.get('/tasks/:id/assigned', tasksController.getAssigned);
router.put('/members/tasks/:taskId', tasksController.unassignTask);
router.post('/tasks/', tasksController.addTask);
router.put('/tasks/:id', tasksController.editTask);
router.post('/tasks/:taskId', tasksController.assignTask);
router.get('/members/:userId/tasks', tasksController.getMemberTasks);
router.delete('/tasks/:id', tasksController.deleteTask);

router.get('/member/:userId/tracks', tasksController.getMemberTracks);
router.post(
  '/member/:userId/tasks/:memberTaskId/track',
  tasksController.trackTask
);
router.get('/member/:userId/progress', tasksController.getMemberProgress);

export default router;
