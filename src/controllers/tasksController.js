import TaskModel from '../models/TaskModel';

exports.getTasks = async (req, res) => {
  res.json((await TaskModel.find({}).exec()).filter((el) => !!el));
};

exports.addTask = async (req, res) => {
  const { taskName, taskDescription, startDate, deadlineDate } = req.body;

  let taskModel = await TaskModel.create({
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

  let taskModel = await TaskModel.updateOne({ _id: taskId }, editObject);

  res.json(taskModel);
};
