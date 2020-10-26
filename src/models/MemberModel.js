const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

let MemberSchema = new Schema({
  firstName: Schema.Types.String,
  lastName: Schema.Types.String,
  birthDate: Schema.Types.Date,
  email: Schema.Types.String,
  directionId: Schema.Types.ObjectId,
  sex: Schema.Types.String,
  education: Schema.Types.String,
  universityAverageScore: Schema.Types.Number,
  mathScore: Schema.Types.Number,
  address: Schema.Types.String,
  mobilePhone: Schema.Types.String,
  skype: Schema.Types.String,
  startDate: Schema.Types.Date,
});

let MemberModel = mongoose.model('member', MemberSchema);

module.exports = MemberModel;
