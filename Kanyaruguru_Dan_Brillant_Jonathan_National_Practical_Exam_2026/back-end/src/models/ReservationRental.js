const pool = require('../config/database');

const ReservationRental = {
  async findAll(search) {
    if (search) {
      const [rows] = await pool.query(`
        SELECT r.*, c.Full_Name AS CustomerName, v.Plate_Number AS VehiclePlate
        FROM Reservation_Rental r
        LEFT JOIN Customer c ON r.customer_id = c.id
        LEFT JOIN Vehicle v ON r.vehicle_id = v.id
        WHERE c.Full_Name LIKE ? OR v.Plate_Number LIKE ? OR r.Reservation_Status LIKE ? OR r.id LIKE ?
      `, [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]);
      return rows;
    }
    const [rows] = await pool.query(`
      SELECT r.*, c.Full_Name AS CustomerName, v.Plate_Number AS VehiclePlate
      FROM Reservation_Rental r
      LEFT JOIN Customer c ON r.customer_id = c.id
      LEFT JOIN Vehicle v ON r.vehicle_id = v.id
    `);
    return rows;
  },

  async findByCustomer(customerId) {
    const [rows] = await pool.query(`
      SELECT r.*, c.Full_Name AS CustomerName, v.Plate_Number AS VehiclePlate,
             v.Brand AS VehicleBrand, v.Model AS VehicleModel
      FROM Reservation_Rental r
      LEFT JOIN Customer c ON r.customer_id = c.id
      LEFT JOIN Vehicle v ON r.vehicle_id = v.id
      WHERE r.customer_id = ?
      ORDER BY r.Start_Date DESC
    `, [customerId]);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT r.*, c.Full_Name AS CustomerName, v.Plate_Number AS VehiclePlate
      FROM Reservation_Rental r
      LEFT JOIN Customer c ON r.customer_id = c.id
      LEFT JOIN Vehicle v ON r.vehicle_id = v.id
      WHERE r.id = ?
    `, [id]);
    return rows[0];
  },

  async create(data) {
    const {
      customer_id, vehicle_id, user_id,
      Reservation_Date, Start_Date, End_Date, Reservation_Status,
      Rental_Date, Return_Date, Rental_Fee, Rental_Status
    } = data;
    const [result] = await pool.query(
      `INSERT INTO Reservation_Rental
       (customer_id, vehicle_id, user_id, Reservation_Date, Start_Date, End_Date, Reservation_Status, Rental_Date, Return_Date, Rental_Fee, Rental_Status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id, vehicle_id, user_id || null,
        Reservation_Date || null, Start_Date, End_Date,
        Reservation_Status || 'pending',
        Rental_Date || null, Return_Date || null,
        Rental_Fee || null, Rental_Status || 'not_started'
      ]
    );
    return { id: result.insertId, ...data };
  },

  async update(id, data) {
    const {
      customer_id, vehicle_id, user_id,
      Reservation_Date, Start_Date, End_Date, Reservation_Status,
      Rental_Date, Return_Date, Rental_Fee, Rental_Status
    } = data;
    await pool.query( 
      `UPDATE Reservation_Rental SET
       customer_id = ?, vehicle_id = ?, user_id = ?,
       Reservation_Date = ?, Start_Date = ?, End_Date = ?,
       Reservation_Status = ?, Rental_Date = ?, Return_Date = ?,
       Rental_Fee = ?, Rental_Status = ?
       WHERE id = ?`,
      [
        customer_id, vehicle_id, user_id,
        Reservation_Date, Start_Date, End_Date,
        Reservation_Status, Rental_Date, Return_Date,
        Rental_Fee, Rental_Status, id
      ]
    );
    return this.findById(id);
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM Reservation_Rental WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = ReservationRental;
