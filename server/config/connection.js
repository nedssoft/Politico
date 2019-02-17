/* istanbul ignore file */
import { Pool } from 'pg';
import dbConfig from './dbConfig';

const env = dbConfig.dbEnv;

const connectionString = dbConfig[env];

const ssl = env === 'production';
const pool = new Pool({
  connectionString,
  ssl,
});


export default pool;
