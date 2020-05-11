import TaskModel from '../models/TaskModel';
import MemberTaskModel from '../models/MemberTaskModel';
import TaskStateModel from '../models/TaskStateModel';
import MemberModel from '../models/MemberModel';
import TrackModel from '../models/TrackModel';
import typeChecker from '../models/typeChecker';

exports.getTasks = async (req, res) => {
  if (req.query.includeAssigned) {
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
  const taskId = req.params.id;
  const assigned = await _getAssigned(taskId);
  res.json(assigned);
};

exports.getTasksWithAssigned = async (req, res) => {
  const tasks = await TaskModel.find({});
  const tasksWithAssigned = await Promise.all(
    tasks.map(
      async ({
        _id: taskId,
        taskName,
        taskDescription,
        startDate,
        deadlineDate,
      }) => {
        return {
          _id: taskId,
          taskName,
          taskDescription,
          startDate,
          deadlineDate,
          assignedTo: await _getAssigned(taskId),
        };
      }
    )
  );

  res.json(tasksWithAssigned);
};

exports.addTask = async (req, res) => {
  const { taskName, taskDescription, startDate, deadlineDate } = req.body;

  const taskModel = await TaskModel.create({
    taskName,
    taskDescription,
    startDate,
    deadlineDate,
  });

  res.json(taskModel);
};

exports.editTask = async (req, res) => {
  const tasksData = req.body;

  const taskId = req.params.id;

  const editObject = {};
  Object.entries(tasksData).forEach(([name, value]) => {
    if (value) {
      editObject[name] = value;
    }
  });

  const taskModel = await TaskModel.findByIdAndUpdate(taskId, editObject);

  res.json(taskModel);
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

  res.json(memberTaskModels);
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

  res.json(memberTaskModels);
};

exports.getMemberTasks = async (req, res) => {
  const { userId } = req.params;

  if (!typeChecker.checkObjectId(userId)) {
    res.status(404);
    res.send('UserId not found');
    return;
  }
  let memberTasks = await MemberTaskModel.find({ userId: userId });

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
  const { userId } = req.params;
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

  res.json(tracks.flat());
};

exports.trackTask = async (req, res) => {
  const { memberTaskId } = req.params;
  const { trackNote, trackDate } = req.body;

  const trackedTask = await TrackModel.find({ memberTaskId });

  if (!trackedTask || !trackedTask.length) {
    res.json({ message: 'Task is already tracked' });
    return;
  }

  const taskModel = await TrackModel.create({
    memberTaskId,
    trackNote,
    trackDate,
  });

  res.json(taskModel);
};

exports.editTrack = async (req, res) => {
  const trackId = req.params.id;
  const { trackDate, trackNote } = req.body;
  const editedTrack = await TrackModel.findByIdAndUpdate(trackId, {
    trackDate,
    trackNote,
  });
  res.json(editedTrack);
};

exports.deleteTrack = async (req, res) => {
  const trackId = req.params.id;
  const deletedTrack = await TrackModel.findByIdAndDelete(trackId);
  res.json(deletedTrack);
};

exports.getMemberProgress = async (req, res) => {
  const { userId } = req.params;
  const memberTasks = await MemberTaskModel.find({ userId });

  const progress = await Promise.all(
    memberTasks.map(async ({ _id }) => {
      const { _id: taskTrackId, memberTaskId, trackNote, trackDate } = (
        await TrackModel.find({ memberTaskId: _id })
      )[0];
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
  console.log(progress);
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
  const taskId = req.params.id;

  const memberTasks = await MemberTaskModel.deleteMany({
    taskId,
  });
  const tracks = await TrackModel.deleteMany({
    taskId,
  });
  const deletedTask = await TaskModel.findByIdAndDelete(taskId);
  res.json({ ...deletedTask.toObject(), memberTasks, tracks });
};
