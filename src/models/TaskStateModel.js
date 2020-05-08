import mongoose, { Schema } from 'mongoose';

let TaskStateSchema = new Schema({
  stateName: Schema.Types.String,
});

let TaskStateModel = mongoose.model('state', TaskStateSchema);

export default TaskStateModel;
