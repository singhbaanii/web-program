function checkAuthStatus(req, res, next) {
  const uid = req.session.uid; //uid exists in session if the user logged in as defined in util/authentication.js

  if (!uid) {
    return next();
  }

  res.locals.uid = uid;
  res.locals.isAuth = true; //sets isAuth to true is the user in authenticated thus logged in
  res.locals.isAdmin = req.session.isAdmin; 
  next();
}

module.exports = checkAuthStatus;