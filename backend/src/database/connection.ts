import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.db_host,
    database: process.env.db_name,
    user: process.env.db_user,
    password: process.env.db_password,
    port: +(process.env.db_port ?? 5432)
})
 
console.log('Successfully connected to database ✅')

export const db = pool;