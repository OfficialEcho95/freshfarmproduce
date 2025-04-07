const { createClient } = require('@redis/client');

const redisClient = createClient({ url: 'redis://127.0.0.1:6379' });


redisClient.connect().catch((error) => {
  console.error('Redis connection error:', error);
});

redisClient.on('error', (error) => {
  console.error('Redis Client Error:', error);
});

module.exports = redisClient;
