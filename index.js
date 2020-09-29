const config = require('config');

const logger = require('./util/logger').createLogger(config.get('logger'));
const server = require('./server');

try {
  logger.info('Starting server');
  server.start(config.get('server'));
} catch (e) {
  logger.error(`Error starting server: ${e}`);
  logger.error(e.stack);
  process.exit(1);
}
