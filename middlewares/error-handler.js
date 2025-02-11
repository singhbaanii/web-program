function handleErrors(error, req, res, next) { //express calls this function when we have an error in the other middlewares or route handler funtions
  console.log(error);

  if (error.code === 404) {
    return res.status(404).render('shared/404');
  }

  res.status(500).render('shared/500'); //5## server side error
}

module.exports = handleErrors;