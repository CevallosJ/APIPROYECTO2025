require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'baseproyecto20255',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// quick test when required
pool.getConnection()
  .then(conn => { conn.release(); console.log('✅ Conexión MySQL establecida'); })
  .catch(err => console.log('❌ MySQL CONEXION ERROR', err.message));

module.exports = pool;