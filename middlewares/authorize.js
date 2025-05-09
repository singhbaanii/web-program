function authorize(resource, action) {
    return function (req, res, next) {
      const user = res.locals.user;

      if (
        resource === 'products' &&
        action === 'read' &&
        (!res.locals.user || !res.locals.user.permissions)
      ) {
        return next();
      }
      
      if (!user || !user.permissions) {
        return res.status(403).render('shared/403');
      }
  
      const resourcePermissions = user.permissions[resource];
  
      if (resourcePermissions && resourcePermissions.includes(action)) {
        return next();
      }
  
      return res.status(403).render('shared/403');

    };
  }
  
  module.exports = authorize;
  