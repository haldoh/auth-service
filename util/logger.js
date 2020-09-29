const pino = require('pino');

const logger = {
  createLogger({ logLabel, logLevel }) {
    return pino({
      name: logLabel,
      level: logLevel,
    });
  },
};

module.exports = logger;
