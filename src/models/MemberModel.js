import mongoose, { Schema } from 'mongoose';

let MemberSchema = new Schema({
  memberId: Schema.Types.ObjectId,
  firstName: Schema.Types.String,
  lastName: Schema.Types.String,
  birthDate: Schema.Types.Date,
  email: Schema.Types.String,
  //   direction: Schema.Types.ObjectId,
  direction: Schema.Types.String,
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

export default MemberModel;
