const jwt = require("jsonwebtoken");

// generate the access token
exports.generateAccessToken = function (userLoggedIn) {
  return jwt.sign(userLoggedIn, process.env.JWTSECRET, { expiresIn: "15m" });
};

// creating a middleware to protect the routes
exports.apiMustBeLoggedIn = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // send Unauthorized status code
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWTSECRET, (err, user) => {
    // send Forbidden status code
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
