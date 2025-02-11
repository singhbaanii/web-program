function addCsrfToken(req, res, next) {
  res.locals.csrfToken = req.csrfToken(); //loacals sets variables that are accesible to all views automattically
  next(); //fuction when executed forwards the request to the next middleware in line
}

module.exports = addCsrfToken;