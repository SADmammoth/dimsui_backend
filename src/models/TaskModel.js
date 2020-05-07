import mongoose, { Schema } from 'mongoose';

let TaskSchema = new Schema({
  taskName: Schema.Types.String,
  taskDescription: Schema.Types.String,
  startDate: Schema.Types.Date,
  deadlineDate: Schema.Types.Date,
});

let TaskModel = mongoose.model('task', TaskSchema);

export default TaskModel;
