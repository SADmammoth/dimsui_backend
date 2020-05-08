import DirectionModel from '../models/DirectionModel';
import TaskStateModel from '../models/TaskStateModel';

exports.createDirections = async (req, res) => {
  const directions = req.body;
  const directionsModels = await Promise.all(
    directions.map((name) => {
      return DirectionModel.create({ name });
    })
  );

  res.json(directionsModels);
};

exports.getDirections = async (req, res) => {
  res.json(await DirectionModel.find({}));
};

exports.createTaskStates = async (req, res) => {
  const taskState = req.body;
  const taskStateModels = await Promise.all(
    taskState.map((stateName) => {
      return TaskStateModel.create({ stateName });
    })
  );

  res.json(taskStateModels);
};
