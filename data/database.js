const mongodb = require('mongodb');
const dotenv = require('dotenv')

dotenv.config() //load .env

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URL); 
  database = client.db('online-shop'); //no return statment cuz async func automattically return the promise
}

function getDb() {
  if (!database) {
    throw new Error('You must connect to database first!');
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb
};

// connect returns a promise these are objects which will eventually resolve to a certain value
// and are often used in situations where you have an asynchronous operation,ie, an operation which may take a bit longer
// and  therefore runs side by side with your other code and which eventually then completes,
// we can handle such promises with help of the '.then' method which we can call on the promise object, or '.catch' if it failed