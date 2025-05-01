function protectRoutes(req, res, next) {
  if (!res.locals.isAuth) {
    return res.redirect('/401');
  }

  const user = res.locals.user;

  if (req.baseUrl.startsWith('/admin')) {
    const isOrdersRoute = req.path.startsWith('/orders');
    const isAdmin = user && user.role === 'admin';
    const isWorkerWithOrdersAccess = user && user.role === 'worker' && isOrdersRoute;

    if (!isAdmin && !isWorkerWithOrdersAccess) {
      return res.redirect('/403');
    }
  }

  next();
}

module.exports = protectRoutes;
