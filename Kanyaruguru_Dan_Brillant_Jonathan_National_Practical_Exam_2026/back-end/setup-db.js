const mysql = require('mysql2/promise');
require('dotenv').config();

const schema = `
CREATE DATABASE IF NOT EXISTS vrs;
USE vrs;

CREATE TABLE IF NOT EXISTS Customer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Full_Name VARCHAR(100) NOT NULL,
  National_ID VARCHAR(50) UNIQUE NOT NULL,
  Phone VARCHAR(20) NOT NULL,
  Email VARCHAR(100),
  Address TEXT,
  Password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Vehicle (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Plate_Number VARCHAR(20) UNIQUE NOT NULL,
  Brand VARCHAR(50) NOT NULL,
  Model VARCHAR(50) NOT NULL,
  Year INT NOT NULL,
  Vehicle_Type VARCHAR(50) NOT NULL,
  Purchase_Price DECIMAL(12, 2) NOT NULL,
  Status VARCHAR(20) DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  UserName VARCHAR(50) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Role VARCHAR(20) DEFAULT 'staff'
);

CREATE TABLE IF NOT EXISTS Reservation_Rental (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  user_id INT,
  Reservation_Date DATE,
  Start_Date DATE NOT NULL,
  End_Date DATE NOT NULL,
  Reservation_Status VARCHAR(20) DEFAULT 'pending',
  Rental_Date DATE,
  Return_Date DATE,
  Rental_Fee DECIMAL(12, 2),
  Rental_Status VARCHAR(20) DEFAULT 'not_started',
  FOREIGN KEY (customer_id) REFERENCES Customer(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES Vehicle(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
  expires INT UNSIGNED NOT NULL,
  data LONGTEXT COLLATE utf8mb4_bin,
  PRIMARY KEY (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
`;

async function setupDatabase() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('Executing database schema...');
    await conn.query(schema);
    console.log('✓ Database schema created successfully!');
  } catch (error) {
    console.error('✗ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

setupDatabase();
