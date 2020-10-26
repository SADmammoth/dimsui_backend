const retrieveFields = require('../helpers/retrieveFields');
const MemberModel = require('../models/MemberModel');
const tasksController = require('./tasksController');
const responseIfModified = require('../helpers/responseIfModified');

exports.getMembers = async (req, res) => {
  res.json((await MemberModel.find({})).filter((el) => !!el));
};

exports.addMember = async (req, res) => {
  await MemberModel.create(
    retrieveFields(req.body, [
      'firstName',
      'lastName',
      'birthDate',
      'email',
      'directionId',
      'sex',
      'education',
      'universityAverageScore',
      'mathScore',
      'address',
      'mobilePhone',
      'skype',
      'startDate',
    ])
  );

  res.send();
};

exports.editMember = async (req, res) => {
  const { id: memberId } = req.params;

  let result = await MemberModel.findByIdAndUpdate(
    memberId,
    retrieveFields(req.body, [
      'firstName',
      'lastName',
      'birthDate',
      'email',
      'directionId',
      'sex',
      'education',
      'universityAverageScore',
      'mathScore',
      'address',
      'mobilePhone',
      'skype',
      'startDate',
    ])
  );

  responseIfModified(result, res);
};

exports.deleteMember = async (req, res) => {
  const { id: userId } = req.params;
  await tasksController._deleteMemberTasks(userId);
  await tasksController._deleteMemberTracks(userId);
  await MemberModel.findByIdAndDelete(userId);
  res.send();
};
