const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);

  const store = new MongoDBStore({ //stores session data using the inbulit constuctor object MongoDBStore into a table calles sessions in our Online-shop DB
    uri: 'mongodb://127.0.0.1:27017',
    databaseName: 'online-shop',
    collection: 'sessions'
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: '8085070404971733620798198198299650481497', //secret key used for securing the session
    resave: false, //prevents resaving sessions unnecessarily
    saveUninitialized: false, //saves session data again to db ony if the data changed
    store: createSessionStore(),
    cookie: {  //if we dont configure cookie the sesssion with be cleared or invalidated every time the user closes the browser 
      maxAge: 2 * 24 * 60 * 60 * 1000 //2 days in milliseconds
    }
  };
}

module.exports = createSessionConfig;