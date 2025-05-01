const express = require('express');

const productsController = require('../controllers/products.controller');
const checkAuth = require('../middlewares/check-auth');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.use(checkAuth);

router.get('/products', authorize('products', 'read'), productsController.getAllProducts);

router.get('/products/:id', authorize('products', 'read'), productsController.getProductDetails);

module.exports = router;