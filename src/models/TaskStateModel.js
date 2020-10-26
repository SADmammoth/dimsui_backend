const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

let TaskStateSchema = new Schema({
  stateName: Schema.Types.String,
});

let TaskStateModel = mongoose.model('state', TaskStateSchema);

module.exports = TaskStateModel;
