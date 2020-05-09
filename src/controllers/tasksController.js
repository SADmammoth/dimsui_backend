import TaskModel from '../models/TaskModel';
import MemberTaskModel from '../models/MemberTaskModel';
import TaskStateModel from '../models/TaskStateModel';
import MemberModel from '../models/MemberModel';
import TrackModel from '../models/TrackModel';

exports.getTasks = async (req, res) => {
  if (req.query.includeAssigned) {
    exports.getTasksWithAssigned(req, res);
  } else {
    const tasks = await TaskModel.find({});
    res.json(tasks);
  }
};

const _getAssigned = async (taskId) => {
  const tasks = await TaskModel.findById(taskId);

  if (!tasks) {
    res.status(404);
    res.send();
    return;
  }

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
  const assigned = _getAssigned(taskId);
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

  let memberTasks = await MemberTaskModel.find({ userId: userId });
  console.log(memberTasks);
  if (!memberTasks || !memberTasks.length) {
    res.json([]);
    return;
  }

  memberTasks = await Promise.all(
    memberTasks.map(async (memberTask) => {
      const {
        taskName,
        taskDescription,
        startDate,
        deadlineDate,
      } = await TaskModel.findById(memberTask.taskId);

      const { taskId, userId, stateId } = memberTask;

      const state = (await TaskStateModel.findById(stateId)).stateName;

      return {
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

  res.json(memberTasks);
};

exports.getMemberTracks = async (req, res) => {
  const { userId } = req.params;
  const memberTasks = await MemberTaskModel.find({ userId });

  const tracks = await Promise.all(
    memberTasks.map(async ({ _id }) => {
      const { memberTaskId, trackNote, trackDate } = (
        await TrackModel.find({ memberTaskId: _id })
      )[0];
      const { taskId } = await MemberTaskModel.findById(memberTaskId);
      const { taskName } = await TaskModel.findById(taskId);

      return {
        taskId,
        userId,
        taskName,
        trackNote,
        trackDate,
      };
    })
  );

  res.json(tracks);
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
        taskId,
        userId,
        taskTrackId,
        taskName,
        trackNote,
        trackDate,
      };
    })
  );

  res.json(progress);
};
