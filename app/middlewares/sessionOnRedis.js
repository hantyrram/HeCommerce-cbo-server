const sessionOnRedis = require('../local_modules/session-on-redis');
const dependencyManager = require('./dependencyManager');

module.exports = sessionOnRedis = sessionOnRedis({redisClient:dependencyManager.dependencies.redisClient});