const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

let TrackSchema = new Schema({
  memberTaskId: Schema.Types.ObjectId,
  trackDate: Schema.Types.Date,
  trackNote: Schema.Types.String,
});

let TrackModel = mongoose.model('track', TrackSchema);

module.exports = TrackModel;
