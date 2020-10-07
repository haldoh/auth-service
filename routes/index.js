const oidc = require('./oidc');
const accounts = require('./accounts');

module.exports = (app, provider) => {
  oidc(app, provider);
  accounts(app);
};
