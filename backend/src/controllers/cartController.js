const { sql } = require('../config/db');


// ➕ Thêm vào giỏ
async function addToCart(req, res) {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    const request = new sql.Request();
    request.input('user_id', sql.Int, user_id);
    request.input('product_id', sql.Int, product_id);

    // kiểm tra đã có chưa
    const check = await request.query(`
      SELECT * FROM cart_items 
      WHERE user_id = @user_id AND product_id = @product_id
    `);

    if (check.recordset.length > 0) {
      // update quantity
      const updateReq = new sql.Request();
      updateReq.input('user_id', sql.Int, user_id);
      updateReq.input('product_id', sql.Int, product_id);
      updateReq.input('quantity', sql.Int, quantity || 1);

      await updateReq.query(`
        UPDATE cart_items 
        SET quantity = quantity + @quantity
        WHERE user_id = @user_id AND product_id = @product_id
      `);

      return res.json({ message: 'Da cap nhat gio hang' });
    }

    // insert mới
    const insertReq = new sql.Request();
    insertReq.input('user_id', sql.Int, user_id);
    insertReq.input('product_id', sql.Int, product_id);
    insertReq.input('quantity', sql.Int, quantity || 1);

    await insertReq.query(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (@user_id, @product_id, @quantity)
    `);

    res.json({ message: 'Them vao gio hang thanh cong' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// 📦 Lấy giỏ hàng
async function getCart(req, res) {
  try {
    const user_id = req.user.id;

    const request = new sql.Request();
    request.input('user_id', sql.Int, user_id);

    const result = await request.query(`
      SELECT 
        c.id,
        c.quantity,
        p.id AS product_id,
        p.name,
        p.price,
        p.image
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = @user_id
    `);

    res.json(result.recordset);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// ✏️ Update số lượng
async function updateCart(req, res) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.input('quantity', sql.Int, quantity);

    await request.query(`
      UPDATE cart_items
      SET quantity = @quantity
      WHERE id = @id
    `);

    res.json({ message: 'Cap nhat thanh cong' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// ❌ Xóa khỏi giỏ
async function deleteCartItem(req, res) {
  try {
    const { id } = req.params;

    const request = new sql.Request();
    request.input('id', sql.Int, id);

    await request.query(`
      DELETE FROM cart_items WHERE id = @id
    `);

    res.json({ message: 'Da xoa san pham khoi gio' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  addToCart,
  getCart,
  updateCart,
  deleteCartItem
};