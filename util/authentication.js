function createUserSession(req, user, action) {
    req.session.uid = user._id.toString(); // stores user id data to the session, _id is the id format used my mongodb internslly in db and we convert to string cuz a mongodb is is a special ObjectId
    req.session.isAdmin = user.isAdmin;
    req.session.isWorker = user.isWorker;
    // console.log(req.session.isAdmin)
    req.session.save(action);
  }
  
function destroyUserAuthSession(req){
    req.session.uid=null; //sets user id to null used for logging out
}

  module.exports = {
    createUserSession: createUserSession,
    destroyUserAuthSession:destroyUserAuthSession
  };