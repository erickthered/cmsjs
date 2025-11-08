import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  redisUrl: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/cms',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};

export default config;
