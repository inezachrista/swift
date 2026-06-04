const pool = require('../config/database');
const bcrypt = require('bcrypt');

const Customer = {
  async findAll(search) {
    if (search) {
      const [rows] = await pool.query(
        'SELECT id, Full_Name, National_ID, Phone, Email, Address FROM Customer WHERE Full_Name LIKE ? OR National_ID LIKE ? OR Phone LIKE ? OR Email LIKE ?',
        [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
      );
      return rows;
    }
    const [rows] = await pool.query('SELECT id, Full_Name, National_ID, Phone, Email, Address FROM Customer');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT id, Full_Name, National_ID, Phone, Email, Address FROM Customer WHERE id = ?', [id]);
    return rows[0];
  },

  async findByNationalId(National_ID) {
    const [rows] = await pool.query('SELECT * FROM Customer WHERE National_ID = ?', [National_ID]);
    return rows[0];
  },

  async create(data) {
    const {Full_Name, National_ID, Phone, Email, Address, Password} = data;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const [result] = await pool.query(
      'INSERT INTO Customer (Full_Name, National_ID, Phone, Email, Address, Password) VALUES (?, ?, ?, ?, ?, ?)',
      [Full_Name, National_ID, Phone, Email, Address, hashedPassword]
    );
    return { id: result.insertId, Full_Name, National_ID, Phone, Email, Address };
  },

  async update(id, data) {
    const { Full_Name, National_ID, Phone, Email, Address } = data;
    await pool.query(
      'UPDATE Customer SET Full_Name = ?, National_ID = ?, Phone = ?, Email = ?, Address = ? WHERE id = ?',
      [Full_Name, National_ID, Phone, Email, Address, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM Customer WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = Customer;