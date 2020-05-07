import express from 'express';
import membersController from '../controllers/membersController';

var router = express.Router();

router.get('/members/', membersController.getMembers);
router.post('/members/', membersController.addMember);

export default router;
