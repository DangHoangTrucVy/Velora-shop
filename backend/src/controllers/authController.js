const { sql } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ họ tên, email, mật khẩu!'
      });
    }

    const checkRequest = new sql.Request();
    checkRequest.input('email', sql.NVarChar, email);

    const checkUser = await checkRequest.query(`
      SELECT * FROM users WHERE email = @email
    `);

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({
        message: 'Email da ton tai'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const request = new sql.Request();
    request.input('name', sql.NVarChar, name);
    request.input('email', sql.NVarChar, email);
    request.input('password', sql.NVarChar, hashedPassword);
    request.input('phone', sql.NVarChar, phone || null);
    request.input('address', sql.NVarChar, address || null);
    request.input('role', sql.NVarChar, 'user');

    await request.query(`
      INSERT INTO users (name, email, password, phone, address, role)
      VALUES (@name, @email, @password, @phone, @address, @role)
    `);

    res.status(201).json({
      message: 'Đăng ký thành công!'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Loi dang ky',
      error: error.message
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Vui lòng nhập email và mật khẩu !'
      });
    }

    const request = new sql.Request();
    request.input('email', sql.NVarChar, email);

    const result = await request.query(`
      SELECT * FROM users WHERE email = @email
    `);

    if (result.recordset.length === 0) {
      return res.status(400).json({
        message: 'Email hoặc mật khẩu không đúng!'
      });
    }

    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Email hoặc mật khẩu không đúng!'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Đăng nhập thành công rồi bấy bì !',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi đăng nhập.',
      error: error.message
    });
  }
}


async function getProfile(req, res) {
  try {
    const request = new sql.Request();
    request.input('id', sql.Int, req.user.id);

    const result = await request.query(`
      SELECT id, name, email, phone, address, role, created_at
      FROM users
      WHERE id = @id
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: 'Không tìm thấy người dùng...'
      });
    }

    res.json({
      message: 'Lấy thông tin người dùng thành công!',
      user: result.recordset[0]
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi lấy profile',
      error: error.message
    });
  }
}

module.exports = {
  register,
  login,
  getProfile
};