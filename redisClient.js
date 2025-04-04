const { createClient } = require('@redis/client');

const client = redis.createClient({
  socket: {
    host: 'redis',   // 🧠 NOT '127.0.0.1'
    port: 6379
  }
});

redisClient.connect().catch((error) => {
  console.error('Redis connection error:', error);
});

redisClient.on('error', (error) => {
  console.error('Redis Client Error:', error);
});

module.exports = redisClient;
