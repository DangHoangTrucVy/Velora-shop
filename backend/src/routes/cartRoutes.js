const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {
  addToCart,
  getCart,
  updateCart,
  deleteCartItem
} = require('../controllers/cartController');

router.post('/', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.put('/:id', authMiddleware, updateCart);
router.delete('/:id', authMiddleware, deleteCartItem);

module.exports = router;