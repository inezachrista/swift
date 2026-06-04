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
    console.log('Database connection established. Running migration checks...');
    
    try {
      // First check what columns currently exist
      const [columns] = await conn.execute(
        `SELECT COLUMN_NAME FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Customer'
         ORDER BY ORDINAL_POSITION`,
        [process.env.DB_NAME || 'vrs']
      );
      
      console.log('Current Customer table columns:', columns.map(c => c.COLUMN_NAME).join(', '));
      
      // Check if we have Full_Name column
      const hasFullName = columns.some(c => c.COLUMN_NAME === 'Full_Name');
      const hasPassword = columns.some(c => c.COLUMN_NAME === 'Password');
      
      if (!hasFullName) {
        console.log('Full_Name column not found. Adding it...');
        try {
          await conn.execute(
            'ALTER TABLE Customer ADD COLUMN Full_Name VARCHAR(100) NOT NULL DEFAULT "" AFTER id'
          );
          console.log('Full_Name column added successfully.');
        } catch (addErr) {
          console.log('Could not add Full_Name, it may already exist as a different case');
        }
      }
      
      if (!hasPassword) {
        console.log('Password column not found. Adding it...');
        await conn.execute(
          'ALTER TABLE Customer ADD COLUMN Password VARCHAR(255) NOT NULL AFTER Address'
        );
        console.log('Password column added successfully.');
      } else {
        console.log('Password column already exists.');
      }
    } catch (tableError) {
      if (tableError.code === 'ER_NO_SUCH_TABLE') {
        console.log('Customer table does not exist. Creating schema...');
        await conn.execute(`
          CREATE TABLE IF NOT EXISTS Customer (
            id INT AUTO_INCREMENT PRIMARY KEY,
            Full_Name VARCHAR(100) NOT NULL,
            National_ID VARCHAR(50) UNIQUE NOT NULL,
            Phone VARCHAR(20) NOT NULL,
            Email VARCHAR(100),
            Address TEXT,
            Password VARCHAR(255) NOT NULL
          )
        `);
        console.log('Customer table created successfully.');
      } else {
        console.log('Table error (may be due to missing privileges):', tableError.message);
      }
    }
    
    conn.release();
  } catch (error) {
    console.error('Database migration error. Code:', error.code);
    console.error('Message:', error.message);
    console.error('State:', error.sqlState);
  }
}

migrate();

module.exports = pool;
