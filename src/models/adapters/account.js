const mongoose = require('mongoose');

const { encrPwd, checkPwd } = require('../../util/pwdUtil');

const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
},
{ timestamps: true });

accountSchema.pre('save', async function encrAccPwd(next) {
  if (!this.isModified('password')) return next();
  this.password = await encrPwd(this.password);
  return next();
});

accountSchema.methods.checkPassword = async function checkAccPwd(pwd) {
  const result = await checkPwd(pwd, this.password);
  this.password = result.hash ? result.hash : this.password;
  return result.valid;
};

module.exports = mongoose.model('Account', accountSchema);
