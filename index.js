/* eslint-disable no-console */

const path = require('path');
const url = require('url');

const set = require('lodash/set');
const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');

const { Provider } = require('oidc-provider');

const Account = require('./models/account');
const configuration = require('./config/configuration');
const modelAdapters = require('./models/adapters');
const routes = require('./routes');

dotenv.config();

const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;
configuration.findAccount = Account.findAccount;

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let server;
(async () => {
  let adapter;
  if (process.env.MONGODB_OIDC_URI) {
    adapter = require('./adapters/mongodb'); // eslint-disable-line global-require
    await adapter.connect();
  }

  const prod = process.env.NODE_ENV === 'production';

  if (prod) {
    set(configuration, 'cookies.short.secure', true);
    set(configuration, 'cookies.long.secure', true);
  }

  const provider = new Provider(ISSUER, { adapter, ...configuration });

  if (prod) {
    app.enable('trust proxy');
    provider.proxy = true;

    app.use((req, res, next) => {
      if (req.secure) {
        next();
      } else if (req.method === 'GET' || req.method === 'HEAD') {
        res.redirect(url.format({
          protocol: 'https',
          host: req.get('host'),
          pathname: req.originalUrl,
        }));
      } else {
        res.status(400).json({
          error: 'invalid_request',
          error_description: 'do yourself a favor and only use https',
        });
      }
    });
  }

  if (process.env.MONGODB_AUTH_URI) {
    modelAdapters();
  }

  routes(app, provider);
  app.use(provider.callback);
  server = app.listen(PORT, () => {
    console.log(`application is listening on port ${PORT}, check its /.well-known/openid-configuration`);
  });
})().catch((err) => {
  if (server && server.listening) server.close();
  console.error(err);
  process.exitCode = 1;
});
