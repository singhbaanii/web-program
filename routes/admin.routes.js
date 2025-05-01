const express = require('express');

const adminController = require('../controllers/admin.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');
const checkAuth = require('../middlewares/check-auth');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.use(checkAuth);

// Products management
router.get('/products', authorize('products', 'read'), adminController.getProducts); // /admin/products

router.get('/products/new', authorize('products', 'create'), adminController.getNewProduct);

router.post('/products', imageUploadMiddleware, authorize('products', 'create'), adminController.createNewProduct);

router.get('/products/:id', authorize('products', 'read'), adminController.getUpdateProduct);

router.post('/products/:id', imageUploadMiddleware, authorize('products', 'update'), adminController.updateProduct);

router.delete('/products/:id', authorize('products', 'delete'), adminController.deleteProduct);

// Orders management
router.get('/orders', authorize('orders', 'read'), adminController.getOrders);

router.patch('/orders/:id', authorize('orders', 'update'), adminController.updateOrder);

module.exports = router;
