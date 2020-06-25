const Router = require('express').Router;
const router = new Router();

const User = require("../models/user");
const {SECRET_KEY} = require("../config");
const ExpressError = require("../helpers/expressError");

const jwt = require("jsonwebtoken");


// Login user route
router.post("/login", async function (req, res, next) {
    try {
      let {username, password} = req.body;
      
      if (await User.authenticate(username, password)) {
      let {is_admin} = await User.get(username)  
      
      let token = jwt.sign({username: username, is_admin: is_admin}, SECRET_KEY);
        return res.json({token});
      } else {
        throw new ExpressError("Invalid username/password", 400);
      }
    }
  
    catch (err) {
      return next(err);
    }
  });

  module.exports = router


