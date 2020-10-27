const TaskModel = require('../models/TaskModel');
const MemberTaskModel = require('../models/MemberTaskModel');
const TaskStateModel = require('../models/TaskStateModel');
const MemberModel = require('../models/MemberModel');
const TrackModel = require('../models/TrackModel');
const userIdFilter = require('../helpers/userIdFilter');
const retrieveFields = require('../helpers/retrieveFields');
const { StatusCodes } = require('http-status-codes');
const responseIfModified = require('../helpers/responseIfModified');

exports.getTasks = async (req, res) => {
  const { includeAssigned, member } = req.query;

  if (member) {
    userIdFilter(req, res, () => exports.getMemberTasks(req, res));
  } else if (includeAssigned) {
    exports.getTasksWithAssigned(req, res);
  } else {
    const tasks = await TaskModel.find({});
    res.json(tasks);
  }
};

const _getAssigned = async (taskId) => {
  const userIds = (await MemberTaskModel.find({ taskId })).map((memberTask) => {
    const { _id: memberTaskId, userId } = memberTask;
    return { memberTaskId, userId };
  });

  const assigned = await Promise.all(
    userIds.map(async ({ memberTaskId, userId }) => {
      const { _id, firstName, lastName } = await MemberModel.findById(userId);
      return { _id, firstName, lastName, memberTaskId };
    })
  );

  return assigned;
};

exports.getAssigned = async (req, res) => {
  const { id: taskId } = req.params;
  const assigned = await _getAssigned(taskId);
  res.json(assigned);
};

exports.getTasksWithAssigned = async (req, res) => {
  const tasks = await TaskModel.find({});
  const tasksWithAssigned = await Promise.all(
    tasks.map(async (task) => {
      return {
        _id: task._id,
        ...retrieveFields(task, [
          'taskName',
          'taskDescription',
          'startDate',
          'deadlineDate',
        ]),
        assignedTo: await _getAssigned(task._id),
      };
    })
  );

  res.json(tasksWithAssigned);
};

exports.addTask = async (req, res) => {
  const task = await TaskModel.create(
    retrieveFields(req.body, [
      'taskName',
      'taskDescription',
      'startDate',
      'deadlineDate',
    ])
  );

  res.json(task._doc._id);
};

exports.editTask = async (req, res) => {
  const { taskId } = req.params;

  const result = await TaskModel.findByIdAndUpdate(
    taskId,
    retrieveFields(req.body, [
      'taskName',
      'taskDescription',
      'startDate',
      'deadlineDate',
    ])
  );

  responseIfModified(result, res);
};

exports.assignTask = async (req, res) => {
  const { taskId } = req.params;
  const stateId = await TaskStateModel.findOne({});
  const userIds = req.body;
  let memberTaskModels = [];

  const alreadyAssigned = (await _getAssigned(taskId)).map(
    ({ userId }) => userId
  );

  await Promise.all(
    userIds.map(async (userId) => {
      if (!alreadyAssigned.includes(userId)) {
        memberTaskModels.push(
          await MemberTaskModel.create({ taskId, userId, stateId })
        );
      }
    })
  );

  res.json();
};

exports.unassignTask = async (req, res) => {
  const { taskId } = req.params;
  const userIds = req.body;
  let memberTaskModels = [];

  await Promise.all(
    userIds.map(async (userId) => {
      memberTaskModels.push(
        await MemberTaskModel.findOneAndDelete({ taskId, userId })
      );
    })
  );

  res.send();
};

exports.getMemberTasks = async (req, res) => {
  const { member: userId } = req.query;
  const user = await MemberModel.find({ userId });

  if (!user) {
    res.status(StatusCodes.NOT_FOUND);
    res.send('UserId not found');
    return;
  }

  let memberTasks = await MemberTaskModel.find({ userId });
  if (!memberTasks || !memberTasks.length) {
    res.json([]);
    return;
  }

  const memberTasksData = await Promise.all(
    memberTasks.map(async (memberTask) => {
      const {
        taskName,
        taskDescription,
        startDate,
        deadlineDate,
      } = await TaskModel.findById(memberTask.taskId);
      const { _id: memberTaskId, taskId, userId, stateId } = memberTask;

      const state = (await TaskStateModel.findById(stateId)).stateName;

      return {
        _id: memberTaskId,
        taskId,
        userId,
        state,
        taskName,
        taskDescription,
        startDate,
        deadlineDate,
      };
    })
  );

  res.json(memberTasksData);
};

exports.getMemberTracks = async (req, res) => {
  const { member: userId } = req.query;
  const user = await MemberModel.find({ userId });

  if (!user) {
    res.status(StatusCodes.NOT_FOUND);
    res.send('UserId not found');
    return;
  }

  const memberTasks = await MemberTaskModel.find({ userId });

  const tracks = await Promise.all(
    memberTasks.map(async ({ _id: memberTaskId, taskId }) => {
      const tracks = await TrackModel.find({ memberTaskId });
      const { taskName } = await TaskModel.findById(taskId);

      return tracks.map(
        ({ _id: trackId, memberTaskId, trackNote, trackDate }) => {
          return {
            _id: trackId,
            memberTaskId,
            taskId,
            userId,
            taskName,
            trackNote,
            trackDate,
          };
        }
      );
    })
  );

  res.json(tracks);
};

exports.trackTask = async (req, res) => {
  const { memberTaskId } = req.query;
  const { trackNote, trackDate } = req.body;

  const trackedTask = await TrackModel.find({ memberTaskId });

  if (trackedTask.length) {
    res.status(StatusCodes.NOT_MODIFIED);
    res.send();
    return;
  }

  await TrackModel.create({
    memberTaskId,
    trackNote,
    trackDate,
  });

  res.send();
};

exports.editTrack = async (req, res) => {
  const trackId = req.params.id;
  const { trackDate, trackNote } = req.body;
  const result = await TrackModel.findByIdAndUpdate(trackId, {
    trackDate,
    trackNote,
  });

  responseIfModified(result, res);
};

exports.deleteTrack = async (req, res) => {
  const trackId = req.params.id;
  const result = await TrackModel.findByIdAndDelete(trackId);

  responseIfModified(result, res);
};

exports.getMemberProgress = async (req, res) => {
  const { member: userId } = req.query;
  const memberTasks = await MemberTaskModel.find({ userId });

  const progress = await Promise.all(
    memberTasks.map(async ({ _id }) => {
      const track = await TrackModel.findOne({ memberTaskId: _id });
      if (!track) {
        res.json([]);
        return;
      }
      const {
        _id: taskTrackId,
        memberTaskId,
        trackNote,
        trackDate,
      } = track._doc;
      const { taskId } = await MemberTaskModel.findById(memberTaskId);
      const { taskName } = await TaskModel.findById(taskId);

      return {
        _id: taskTrackId,
        taskId,
        userId,
        memberTaskId,
        taskName,
        trackNote,
        trackDate,
      };
    })
  );

  res.json(progress);
};

exports._deleteMemberTasks = async (userId) => {
  const deletedTasks = await MemberTaskModel.deleteMany({
    userId,
  });
  return deletedTasks;
};
exports._deleteMemberTracks = async (userId) => {
  const deletedTracks = await TrackModel.deleteMany({
    userId,
  });
  return deletedTracks;
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  await MemberTaskModel.deleteMany({
    taskId,
  });
  await TrackModel.deleteMany({
    taskId,
  });
  await TaskModel.findByIdAndDelete(taskId);

  res.send();
};

exports.setMemberTaskState = async (req, res) => {
  const { taskId } = req.params;
  const { member: userId } = req.query;
  const { status: state } = req.body;

  const stateId = (await TaskStateModel.findOne({ stateName: state }))._id;
  const result = await MemberTaskModel.updateOne(
    { taskId, userId },
    { stateId }
  );

  responseIfModified(result, res);
};
