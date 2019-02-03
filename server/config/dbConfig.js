
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  test: process.env.DB_TEST,
  development: process.env.DB_DEV,
  production: process.env.DB_PROD,
  dbEnv: process.env.NODE_ENV || 'development',
};

export default dbConfig;
