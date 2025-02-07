const Product = require('../models/product.model');

async function getCart(req, res) {
  res.render('customer/cart/cart');
}

async function addCartItem(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (error) {
    next(error);
    return;
  }

  const cart = res.locals.cart;

  const existingCartItem = cart.items.find(function(item) {
    return item.product.id === product.id;
  });
  
  let requestedQuantity;
  if (existingCartItem) {
    requestedQuantity = existingCartItem.quantity + 1;
  } else {
    requestedQuantity = 1;
  }


  if (requestedQuantity > product.quantity) {
    return res.status(400).json({
      message: `Insufficient stock for product: ${product.title}`,
      availableQuantity: product.quantity
    });
  }

  cart.addItem(product);
  req.session.cart = cart;

  res.status(201).json({
    message: 'Cart updated!',
    newTotalItems: cart.totalQuantity,
  });
}


function updateCartItem(req, res) {
  const cart = res.locals.cart;
  const newQuantity = +req.body.quantity;

  const cartItem = cart.items.find(function(item) {
    return item.product.id === req.body.productId;
  });

  
  if (!cartItem) {
    return res.status(404).json({ message: 'Item not found in cart.' });
  }

  
  if (newQuantity > cartItem.product.quantity) { // Check if the requested quantity exceeds the product stock
    return res.status(400).json({
      message: `Insufficient stock for product: ${cartItem.product.title}`,
      maxQuantity: cartItem.product.quantity,
    });
  }

  const updatedItemData = cart.updateItem(req.body.productId, newQuantity);

  req.session.cart = cart;

  res.json({
    message: 'Item updated!',
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice,
      updateItemQuantity: updatedItemData.updateItemQuantity,
    },
  });
}


module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updateCartItem: updateCartItem,
};