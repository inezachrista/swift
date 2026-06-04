const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vrs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function migrate() {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Customer' AND COLUMN_NAME = 'Password'`,
      [process.env.DB_NAME || 'vrs']
    );
    if (rows.length === 0) {
      await conn.execute(
        'ALTER TABLE Customer ADD COLUMN Password VARCHAR(255) NOT NULL AFTER Address'
      );
    }
    conn.release();
  } catch {}
}

migrate();

module.exports = pool;
