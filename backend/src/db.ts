import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

console.log('Database Config:', {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD ? '***' : 'NOT SET'
});

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || 'baskent_mezun',
});

pool.on('error', (err: Error) => {
  console.error('❌ Database Pool Error:', err.message);
});

pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

export default pool;
