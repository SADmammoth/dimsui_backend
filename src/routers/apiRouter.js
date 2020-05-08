import express from 'express';
import membersController from '../controllers/membersController';
import databaseInit from '../controllers/databaseInit';
import tasksController from '../controllers/tasksController';

var router = express.Router();

router.get('/directions', databaseInit.getDirections);
router.post('/directions', databaseInit.createDirections);
router.post('/states', databaseInit.createTaskStates);

router.get('/members/', membersController.getMembers);
router.post('/members/', membersController.addMember);
router.put('/members/:id', membersController.editMember);

router.get(
  '/tasks/?includeAssigned=true',
  tasksController.getTasksWithAssigned
);
router.get('/tasks/', tasksController.getTasks);
router.get('/tasks/:id/assigned', tasksController.getAssigned);
router.post('/tasks/', tasksController.addTask);
router.put('/tasks/:id', tasksController.editTask);
router.post('/tasks/:taskId', tasksController.assignTask);
router.get('/members/:memberId/tasks', tasksController.getMemberTasks);

export default router;
