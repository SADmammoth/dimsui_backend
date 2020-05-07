import express from 'express';
import membersController from '../controllers/membersController';
import databaseInit from '../controllers/databaseInit';

var router = express.Router();

router.get('/members/', membersController.getMembers);
router.post('/members/', membersController.addMember);
router.put('/members/:id', membersController.editMember);
router.get('/directions', databaseInit.getDirections);
router.post('/directions', databaseInit.createDirections);

export default router;
