const pool = require('../config/database');
const bcrypt = require('bcrypt');

const User = {
  async findAll() {
    const [rows] = await pool.query('SELECT id, UserName, Role FROM Users');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT id, UserName, Role FROM Users WHERE id = ?', [id]);
    return rows[0];
  },

  async findByUsername(UserName) {
    const [rows] = await pool.query('SELECT * FROM Users WHERE UserName = ?', [UserName]);
    return rows[0];
  },

  async create(data) {
    const { UserName, Password, Role } = data;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const [result] = await pool.query(
      'INSERT INTO Users (UserName, Password, Role) VALUES (?, ?, ?)',
      [UserName, hashedPassword, Role || 'staff']
    );
    return { id: result.insertId, UserName, Role: Role || 'staff' };
  },

  async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  async update(id, data) {
    const { UserName, Role } = data;
    await pool.query(
      'UPDATE Users SET UserName = ?, Role = ? WHERE id = ?',
      [UserName, Role, id]
    );
    return this.findById(id);
  },

  async updatePassword(id, Password) {
    const hashedPassword = await bcrypt.hash(Password, 10);
    await pool.query('UPDATE Users SET Password = ? WHERE id = ?', [hashedPassword, id]);
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM Users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = User;
