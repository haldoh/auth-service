const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect(process.env.MONGODB_AUTH_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  require('./account'); // eslint-disable-line global-require
};
