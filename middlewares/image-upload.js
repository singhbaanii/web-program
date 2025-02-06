const multer = require('multer'); //mutler configuration so we can save rename the file and keep the file extention
const uuid = require('uuid').v4;

const upload = multer({
  storage: multer.diskStorage({
    destination: 'product-data/images',  // tells us where to store the upladed file
    filename: function(req, file, cb) {  //cb is a call back function we call in our function once we come up with the filename
      cb(null, uuid() + '-' + file.originalname); //first field is for potential error we face since we have no error its null
    } //second value is foe the filename here we use the uuid package, which we run as a function and it returns a unique string
  })
});

const configuredMulterMiddleware = upload.single('image');

module.exports = configuredMulterMiddleware;