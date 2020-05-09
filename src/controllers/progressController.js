import TaskModel from '../models/TaskModel';
import MemberTaskModel from '../models/MemberTaskModel';
import TaskStateModel from '../models/TaskStateModel';
import MemberModel from '../models/MemberModel';

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
