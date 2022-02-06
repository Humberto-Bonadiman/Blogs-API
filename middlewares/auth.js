require('dotenv').config();
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const { JWT_SECRET } = process.env;

const isEmailValid = (email) => {
  const regexEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regexEmail.test(email);
};

const validateDisplay = (req, res, next) => {
  const { displayName } = req.body;
  if (displayName.length < 8) {
    return res.status(400)
      .json({ message: '"displayName" length must be at least 8 characters long' });
  }

  next();
};

const validateEmail = async (req, res, next) => {
  const { email } = req.body;
  const lookEmail = await User.findOne({ where: { email } });
  if (lookEmail) {
    return res.status(409).json({ message: 'User already registered' });
  }
  if (!email) {
    return res.status(400).json({ message: '"email" is required' });
  }

  if (isEmailValid(email) === false) {
    return res.status(400).json({ message: '"email" must be a valid email' });
  }

  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: '"password" is required' });
  }

  if (password.length !== 6) {
    return res.status(400).json({ message: '"password" length must be 6 characters long' });
  }

  next();
};

const validateUser = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Token não encontrado' });
  }
  const decoded = jwt.verify(authorization, JWT_SECRET);
  const user = await User.findOne({ where: { email: decoded.data.email } });

  if (user) {
    return res.status(409).json({ message: 'User already registered' });
  }
  req.user = user;

  next();
};

module.exports = {
  validateDisplay,
  validateEmail,
  validatePassword,
  validateUser,
};