const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();  // Save the order first

    for (const item of cart.items) {   // Reduce product quantities in stock after the order is placed
      const product = await Product.findById(item.product.id);
      if (product.quantity >= item.quantity) {
        product.quantity -= item.quantity;
        await product.save();
      } else {
        return next(new Error(`Insufficient stock for product: ${product.title}`));
      }
    }

  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;

  res.redirect('/orders');
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
};