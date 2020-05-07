import DirectionModel from '../models/DirectionModel';

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
