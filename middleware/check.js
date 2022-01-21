function check(req, res, next) {
  console.log("A http request is raised...");
  next();
}

module.exports = check;
