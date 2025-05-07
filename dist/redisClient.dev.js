"use strict";

// /* eslint-disable jest/require-hook */
// const { createClient } = require('@redis/client');
// // const redisHost = process.env.REDIS_HOST || 'localhost';
// // const redisPort = process.env.REDIS_PORT || 6379;
// const redisClient = createClient({
//   url: 'redis://localhost:6379',
// });
// redisClient.connect().catch((error) => {
//   console.error('Redis connection error:', error);
// });
// redisClient.on('error', (error) => {
//   console.error('Redis Client Error:', error);
// });
// module.exports = redisClient;
var _require = require('@upstash/redis'),
    Redis = _require.Redis;

var redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
}); // Set value in Redis

redis.set('foo', 'bar').then(function () {
  console.log('Data set successfully'); // Get value from Redis

  return redis.get('foo');
}).then(function (data) {
  console.log('Data from Redis:', data); // 'bar'
})["catch"](function (error) {
  console.error('Error interacting with Redis:', error);
});