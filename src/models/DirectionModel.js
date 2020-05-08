import mongoose, { Schema } from 'mongoose';

let DirectionSchema = new Schema({
  name: Schema.Types.String,
});

let DirectionModel = mongoose.model('direction', DirectionSchema);

export default DirectionModel;
