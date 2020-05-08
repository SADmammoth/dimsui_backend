import mongoose, { Schema } from 'mongoose';

let MemberTaskSchema = new Schema({
  taskId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  stateId: Schema.Types.ObjectId,
});

let MemberTaskModel = mongoose.model('memberTask', MemberTaskSchema);

export default MemberTaskModel;
