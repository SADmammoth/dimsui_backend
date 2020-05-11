import mongoose from 'mongoose';

exports.checkObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};
