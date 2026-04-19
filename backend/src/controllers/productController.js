const { sql } = require('../config/db');

async function getAllProducts(req, res) {
  try {
    const result = await sql.query`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.old_price,
        p.description,
        p.stock,
        p.image,
        p.category_id,
        p.created_at,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `;

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({
      message: 'Loi lay danh sach products',
      error: error.message
    });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const request = new sql.Request();
    request.input('id', sql.Int, id);

    const result = await request.query(`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.old_price,
        p.description,
        p.stock,
        p.image,
        p.category_id,
        p.created_at,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = @id
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: 'Khong tim thay san pham'
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Loi lay chi tiet product',
      error: error.message
    });
  }
}

module.exports = {
  getAllProducts,
  getProductById
};