function protectRoutes(req, res, next) {
    if (!res.locals.isAuth) {
      return res.redirect('/401');
    }
  
    if (req.baseUrl.startsWith('/admin')) {
      if (!res.locals.user || res.locals.user.role !== 'admin') {
        return res.redirect('/403');
      }
    }
  
    next();  
  }
  
  module.exports = protectRoutes;