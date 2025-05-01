const express = require('express');

const cartController = require('../controllers/cart.controller');
const checkAuth = require('../middlewares/check-auth');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.use(checkAuth);

router.get('/', authorize('cart', 'read'), cartController.getCart); // /cart/

router.post('/items', authorize('cart', 'create'), cartController.addCartItem); // /cart/items

router.patch('/items', authorize('cart', 'update'), cartController.updateCartItem);

module.exports = router;