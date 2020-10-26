const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

let DirectionSchema = new Schema({
  name: Schema.Types.String,
});

let DirectionModel = mongoose.model('direction', DirectionSchema);

module.exports = DirectionModel;
