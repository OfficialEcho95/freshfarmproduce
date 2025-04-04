"use strict";

var _require = require('@redis/client'),
    createClient = _require.createClient;

var client = redis.createClient({
  socket: {
    host: 'redis',
    // 🧠 NOT '127.0.0.1'
    port: 6379
  }
});
redisClient.connect()["catch"](function (error) {
  console.error('Redis connection error:', error);
});
redisClient.on('error', function (error) {
  console.error('Redis Client Error:', error);
});
module.exports = redisClient;