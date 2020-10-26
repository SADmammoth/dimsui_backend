const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

let MemberTaskSchema = new Schema({
  taskId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  stateId: Schema.Types.ObjectId,
});

let MemberTaskModel = mongoose.model('memberTask', MemberTaskSchema);

module.exports = MemberTaskModel;
