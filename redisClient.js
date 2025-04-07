/* eslint-disable jest/require-hook */
const { createClient } = require('@redis/client');

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

const redisClient = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

redisClient.connect().catch((error) => {
  console.error('Redis connection error:', error);
});

redisClient.on('error', (error) => {
  console.error('Redis Client Error:', error);
});

module.exports = redisClient;
