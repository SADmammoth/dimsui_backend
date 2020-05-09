import mongoose, { Schema } from 'mongoose';

let TrackSchema = new Schema({
  memberTaskId: Schema.Types.ObjectId,
  trackDate: Schema.Types.Date,
  trackNote: Schema.Types.String,
});

let TrackModel = mongoose.model('track', TrackSchema);

export default TrackModel;
