const User = require("../models/User");
const authServer = require("../authServer");
//const jwt  = require('jsonwebtoken')

exports.register = function (req, res) {
  let user = new User(req.body);
    user.register().then(value => {
    res.json(value);
    // console.log(value)
    }).catch(err => {
    res.json(err);
    });
};

exports.login = function (req, res) {
  let user = new User(req.body);
  user.login()
      .then(function (id) {
      //res.json(user)
      const userLoggedIn = { username: user.data.username, LoggedInUserId: id};
      const accessToken = authServer.generateAccessToken(userLoggedIn);
      res.json({ accessToken: accessToken, LoggedInUserId: id });
       })
    .catch(function (e) {
      res.json(e);
    });
};
