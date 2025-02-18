const mongodb = require('mongodb');

const db = require('../data/database');

class Order {
  // Status => pending, fulfilled, cancelled
  constructor(cart, userData, status = 'pending', date, orderId) {
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);  //built in date constructor
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    this.id = orderId;
  }

  static transformOrderDocument(orderDoc) {
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  static transformOrderDocuments(orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
  }

  static async findAll() {
    const orders = await db.getDb().collection('orders').find().sort({ _id: -1 }).toArray(); //desc order

    return this.transformOrderDocuments(orders);
  }

  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId);

    const orders = await db.getDb().collection('orders').find({ 'userData._id': uid }).sort({ _id: -1 }) .toArray();
    //object ids are made taking time into consideration this is in desc ,ie lastest order first

    return this.transformOrderDocuments(orders);
  }

  static async findById(orderId) {
    const order = await db.getDb().collection('orders').findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }

  save() {
    if (this.id) {
      const orderId = new mongodb.ObjectId(this.id);
      return db.getDb().collection('orders').updateOne({ _id: orderId }, { $set: { status: this.status } });
    } else {
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),  //if u dont pass any value in it it passes current date time snapshot
        status: this.status,
      };

      return db.getDb().collection('orders').insertOne(orderDocument); //dont need to use async await cuz we return
    }
  }
}

module.exports = Order;