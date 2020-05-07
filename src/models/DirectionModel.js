import mongoose, { Schema } from 'mongoose';

let MemberSchema = new Schema({
  name: Schema.Types.String,
});

let MemberModel = mongoose.model('direction', MemberSchema);

export default MemberModel;
