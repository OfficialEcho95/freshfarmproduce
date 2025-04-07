"use strict";

/* eslint-disable jest/require-hook */
var _require = require('@redis/client'),
    createClient = _require.createClient;

var redisHost = process.env.REDIS_HOST || 'localhost';
var redisPort = process.env.REDIS_PORT || 6379;
var redisClient = createClient({
  url: "redis://".concat(redisHost, ":").concat(redisPort)
});
redisClient.connect()["catch"](function (error) {
  console.error('Redis connection error:', error);
});
redisClient.on('error', function (error) {
  console.error('Redis Client Error:', error);
});
module.exports = redisClient;