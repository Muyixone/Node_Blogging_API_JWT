const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const util = require('util');

const userModel = require('../models/users_model');
const tryCatchErr = require('../utilities/catchErrors');
const serverErr = require('../utilities/serverError');
const CONFIG = require('../config/config');

const JWT_SECRET = CONFIG.JWT_SECRET;

// const JWT_EXPIRY = process.env.JWT_EXPIRY

//Create token function and set expiration to 1hr
const signInToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });
};

////////////////////////////////////////////////////////////////
/*
 * SIGN IN NEW USER
 */
/////////////////////////////////////////////////////////////////

exports.createUser = tryCatchErr(async (req, res, next) => {
  const user = await userModel.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  });

  //console.log(user);
  const token = signInToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
});

////////////////////////////////////////////////////////////////
/*
 * LOGIN IN USER
 */
/////////////////////////////////////////////////////////////////

exports.login = tryCatchErr(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new serverErr('Provide a valid email and password', 401));
  }
  const user = await userModel.findOne({ email }).select('+password');
  if (!user) {
    return next(new serverErr('User not found', 401));
  }
  const validatePassword = bcrypt.compare(password, user.password);
  if (!validatePassword) {
    return next(new serverErr('Wrong email and/or password', 401));
  }
  const token = signInToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
  });
});

////////////////////////////////////////////////////////////////////////
/*
 * Authenticating routes
 */
///////////////////////////////////////////////////////////////////////

exports.authenticate = tryCatchErr(async (req, res, next) => {
  let bearerToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    bearerToken = req.headers.authorization.split(' ')[1];
  }
  if (!bearerToken) {
    return next(new serverErr('Unauthirized, Login to continue', 401));
  }

  //Verify token
  const user = await util.promisify(jwt.verify)(bearerToken, JWT_SECRET);

  //Confirm if user still exists
  const currentUser = await userModel.findById(user.id);
  if (!currentUser) {
    return next(new serverErr('User does not exist', 401));
  }
  req.user = currentUser;
  next();
});
