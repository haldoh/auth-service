const path = require('path');

const fastify = require('fastify');
const AutoLoad = require('fastify-autoload');
const Cors = require('fastify-cors');
const Helmet = require('fastify-helmet');

const logger = require('./util/logger');

const start = (config) => {
  const loggerI = logger.createLogger(config.logger);
  const server = fastify({
    logger: loggerI,
  });

  server
    .register(Cors)
    .register(Helmet);

  server.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { config },
  });

  server.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
  });

  server.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
  });

  try {
    server.log.debug(`Starting <<${config.service}>> server with config ${JSON.stringify(config)}`);
    server.listen(config.port);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

module.exports = {
  start,
};
