const { sql } = require('../config/db');

async function getAllCategories(req, res) {
  try {
    const result = await sql.query`SELECT * FROM categories ORDER BY id DESC`;
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({
      message: 'Loi lay danh sach categories',
      error: error.message
    });
  }
}

module.exports = {
  getAllCategories
};