function getSessionData(req) {
    const sessionData = req.session.flashedData; //retrieves data to be flashed
  
    req.session.flashedData = null; //clears data after it has been flashed
  
    return sessionData;
  }
  
  function flashDataToSession(req, data, action) {
    req.session.flashedData = data; //addidng arbitrary data called flashed data to session
    req.session.save(action); //save takes the function as a parameter value and executes it once the saving of data was completed
  }
  
  module.exports = {
    getSessionData: getSessionData,
    flashDataToSession: flashDataToSession
  };