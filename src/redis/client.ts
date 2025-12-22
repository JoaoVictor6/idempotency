import { Redis } from 'ioredis';

const redisClient = new Redis(
  parseInt(process.env.REDIS_PORT || '6379', 10),
  process.env.REDIS_HOST || 'localhost');

redisClient.on('connect', () => {
  console.log('Connected to Redis!');
});

redisClient.on('error', (err: Error) => {
  console.error('Redis Client Error', err);
});

export default redisClient;
