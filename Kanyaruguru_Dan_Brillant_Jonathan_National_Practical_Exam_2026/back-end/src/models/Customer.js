const pool = require('../config/database');

const Customer = {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM Customer');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Customer WHERE id = ?', [id]);
    return rows[0];
  },

  async create(data) {
    const { Full_Nmae, National_ID, Phone, Email, Address } = data;
    const [result] = await pool.query(
      'INSERT INTO Customer (Full_Nmae, National_ID, Phone, Email, Address) VALUES (?, ?, ?, ?, ?)',
      [Full_Nmae, National_ID, Phone, Email, Address]
    );
    return { id: result.insertId, ...data };
  },

  async update(id, data) {
    const { Full_Nmae, National_ID, Phone, Email, Address } = data;
    await pool.query(
      'UPDATE Customer SET Full_Nmae = ?, National_ID = ?, Phone = ?, Email = ?, Address = ? WHERE id = ?',
      [Full_Nmae, National_ID, Phone, Email, Address, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM Customer WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Customer;
