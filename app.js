const path = require('path');
//initalising server using express
const express = require('express'); //its the http equivalent for expressJS, express is a function that helps manage routes, middleware and parsing request bodies
const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found');
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');

const app = express(); //app object exuting express as a function

app.set('view engine','ejs'); //sets up ejs for expess to be albe to use
app.set('views', path.join(__dirname,'views')); //built-in path package allows us to create a path that will be recognized on all operating systems.

app.use(express.static('public')); //static makes all the files available to the web browser without any server side processing. File is served exactly as it is stored on the server
app.use('/products/assets', express.static('product-data')); //servers uploaded images statically with our specific URL of choice for 
// requesting data that is not the same as the folder stucture on the server, this doesnt give the user information about our folder 
// stucutre with is import for security reasons 
app.use(express.urlencoded({ extended: false })); //handels data that is coming in attached to reqiuest(eg- lets us access req.body fields) specifically form submission, extened is false so it only supports regualr form submission
app.use(express.json()); //to extract data from json format in ajax request, like for the app to cart

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', protectRoutesMiddleware, ordersRoutes);
app.use('/admin', protectRoutesMiddleware, adminRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () { //if successful 
    app.listen(3000);
  })
  .catch(function (error) { //if connection failed
    console.log('Failed to connect to the database!');
    console.log(error);
  });