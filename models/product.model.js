const mongodb = require('mongodb');

const db = require('../data/database');

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price; //+ forces it to convert to a number
    this.description = productData.description;
    this.quantity = +productData.quantity;
    this.image = productData.image; // the name of the image file
    this.updateImageData();
    if (productData._id) {  //when new product is created it will be undefined so we check if product exists already first
      this.id = productData._id.toString(); 
    }
  }

  static async findById(productId) { 
    let prodId;
    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db
      .getDb()
      .collection('products')
      .findOne({ _id: prodId });

    if (!product) {
      const error = new Error('Could not find product with provided id.'); //the built in 'error' class which here generates a new JS object with some internal error info and our own custom message 
      error.code = 404; //404 is not found code
      throw error;
    }

    return new Product(product);
  }

  static async findAll() { //static so that we dont need to instantiate it but can rather look for product data instead
    const products = await db.getDb().collection('products').find().toArray();

    return products.map(function (productDocument) { //mapis a utility method u can execute on any array in js. Map takes a fuction and executes it on every element in the array 
      return new Product(productDocument); // we do this to rebuild the image path and image url fields which were not srored in the database 
    });//this transforms an array full of mongodb documents into an full of product objects that follow the blue print defined in the constructor
  }

  static async findMultiple(ids) {
    const productIds = ids.map(function(id) {
      return new mongodb.ObjectId(id);
    })
    
    const products = await db
      .getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`; //image path as its stored in the server side backend
    this.imageUrl = `/products/assets/images/${this.image}`; //image url in the front end used by browser to request the image
    //the url path defined here is up to the us the developer, and the backend code for finding the appropriate image needs to be written
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image, //we store just the image name in db, and derive the folder path for image dynamically in the code so that we have felxibility to change our folder stucture
      quantity: this.quantity
    };

    if (this.id) {
      const productId = new mongodb.ObjectId(this.id);

      if (!this.image) {
        delete productData.image; //we use delete because incase no new image is added we dont want to overrite the old one with null or undefined
      }

      await db.getDb().collection('products').updateOne(
        { _id: productId },
        {
          $set: productData,
        }
      );
    } else {
      await db.getDb().collection('products').insertOne(productData); //insertone returns promise so we await it 
    }
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  remove() {
    const productId = new mongodb.ObjectId(this.id);
    return db.getDb().collection('products').deleteOne({ _id: productId });
  }
}

module.exports = Product;