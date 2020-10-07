const Account = require('../models/adapters/account');

module.exports = (app) => {
  app.post('/accounts', async (req, res, next) => {
    const acc = new Account(req.body);
    try {
      await acc.save();
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  });
};
