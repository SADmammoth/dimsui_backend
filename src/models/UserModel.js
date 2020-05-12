import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

const userSchema = new Schema(
  {
    userId: Schema.Types.ObjectId,
    login: {
      type: Schema.Types.String,
      required: 'Provide login',
      unique: 'Login is already exists',
    },
    passwordHash: Schema.Types.String,
    salt: Schema.Types.String,
  },
  {
    timestamps: true,
  }
);

userSchema
  .virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    if (password) {
      this.salt = crypto.randomBytes(128).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(
        password,
        this.salt,
        1,
        128,
        'sha1'
      );
    } else {
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })

  .get(function () {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function (password) {
  console.log(this.passwordHash);
  if (!password) return false;
  if (!this.passwordHash) return false;
  return (
    crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash
  );
};

const UserModel = mongoose.model('user', userSchema);

export default UserModel;