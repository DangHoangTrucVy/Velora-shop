const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function connectDB() {
  try {
    await sql.connect(config);
    console.log('Kết nối SQL Server thành công !');
  } catch (error) {
    console.error('Kết nối Server SQL thất bại ...', error.message);
    throw error;
  }
}

module.exports = {
  sql,
  connectDB
};