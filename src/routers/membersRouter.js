const express = require('express');
const membersController = require('../controllers/membersController');
const roleFilter = require('../helpers/roleFilter');
const ADMIN = require('../helpers/roles').ADMIN;
const MENTOR = require('../helpers/roles').MENTOR;

var membersRouter = express.Router();

membersRouter.get(
  '/members/profiles',
  roleFilter(ADMIN, MENTOR),
  membersController.getMembers
);

membersRouter.post(
  '/members/profiles',
  roleFilter(ADMIN),
  membersController.addMember
);

membersRouter.put(
  '/members/:id/profile',
  roleFilter(ADMIN),
  membersController.editMember
);

membersRouter.delete(
  '/members/:id/profile',
  roleFilter(ADMIN),
  membersController.deleteMember
);

module.exports = membersRouter;
