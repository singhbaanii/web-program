const express = require('express');

const ordersController = require('../controllers/orders.controller');
const checkAuth = require('../middlewares/check-auth');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.use(checkAuth);

router.get('/', authorize('orders', 'read'), ordersController.getOrders); // /orders
router.post('/', authorize('orders', 'create'), ordersController.addOrder); // /orders

module.exports = router;