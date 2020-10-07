const mongoose = require('mongoose');
const securePassword = require('secure-password');

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

accountSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const pwd = securePassword();
  const userPassword = Buffer.from(this.password);
  this.password = await pwd.hash(userPassword);
  return next();
});

module.exports = mongoose.model('Account', accountSchema);
