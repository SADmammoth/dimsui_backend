import express from 'express';
import membersController from '../controllers/membersController';
import roleFilter from '../helpers/roleFilter';

var membersRouter = express.Router();

membersRouter.get(
  '/members/profile',
  roleFilter('admin', 'mentor'),
  membersController.getMembers
);

membersRouter.post(
  '/members/profile',
  roleFilter('admin'),
  membersController.addMember
);

membersRouter.put(
  '/members/:id/profile',
  roleFilter('admin'),
  membersController.editMember
);

membersRouter.delete(
  '/members/:id',
  roleFilter('admin'),
  membersController.deleteMember
);

export default membersRouter;
