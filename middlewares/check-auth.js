const db = require('../data/database');
const mongodb = require('mongodb');

async function checkAuthStatus(req, res, next) {
  const uid = req.session.uid;

  if (!uid) {
    return next();
  }

  try {
    const user = await db.getDb().collection('users').findOne({ _id: new mongodb.ObjectId(uid) });

    if (!user) {
      return next();
    }

    const roleData = await db.getDb().collection('roles').findOne({ name: user.role });

    res.locals.uid = uid;
    res.locals.isAuth = true;
    res.locals.user = {
      role: roleData && roleData.name ? roleData.name : null,
      permissions: roleData && roleData.permissions ? roleData.permissions : {}
    };

    next();
  } catch (error) {
    console.error('Error loading auth status:', error);
    next();
  }
}

module.exports = checkAuthStatus;
