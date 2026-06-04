const pool = require('../config/database');

const Vehicle = {
  async findAll(search) {
    if (search) {
      const [rows] = await pool.query(
        `SELECT * FROM Vehicle WHERE Plate_Number LIKE ? OR Brand LIKE ? OR Model LIKE ? OR Vehicle_Type LIKE ?`,
        [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
      );
      return rows;
    }
    const [rows] = await pool.query('SELECT * FROM Vehicle');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Vehicle WHERE id = ?', [id]);
    return rows[0];
  },

  async create(data) {
    const { Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status } = data;
    const [result] = await pool.query(
      'INSERT INTO Vehicle (Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status || 'available']
    );
    return { id: result.insertId, ...data, Status: Status || 'available' };
  },

  async update(id, data) {
    const { Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status } = data;
    await pool.query(
      'UPDATE Vehicle SET Plate_Number = ?, Brand = ?, Model = ?, Year = ?, Vehicle_Type = ?, Purchase_Price = ?, Status = ? WHERE id = ?',
      [Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM Vehicle WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Vehicle;
