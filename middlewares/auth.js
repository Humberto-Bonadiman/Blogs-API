require('dotenv').config();
const jwt = require('jsonwebtoken');

const { JWT_KEY } = process.env;

if (!JWT_KEY) {
  const error = Error;
  error.message = 'JWT_KEY não foi definido no .env';
  throw error;
}

const isEmailValid = (email) => {
  const regexEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regexEmail.test(email);
};

const { User } = require('../models');

const validateToken = async (req, res, next) => {
  const { authorization } = req.headers;

  const verifyToken = jwt.verify(authorization, JWT_KEY);

  if (!authorization || !verifyToken) {
    return res.status(409).json({ message: 'Token não encontrado!' });
  }

  next();
};

const validateUser = async (req, res, next) => {
  const { authorization } = req.headers;

  const verifyToken = jwt.verify(authorization, JWT_KEY);
  // const user = await User.findOne({ where: { email } });
  const user = await User.findOne({ where: { email: verifyToken.data.email } });

  if (user) {
    return res.status(409).json({ message: 'User already registered' });
  }

  next();
};

const displayNameBiggerThan = (req, res, next) => {
  try {
    const { displayName } = req.body;
    if (displayName.length < 8) {
      return res.status(400)
      .json({ message: '"displayName" length must be at least 8 characters long' });
    }

    next();
  } catch (err) {
    console.error(err);
  }
};

const checkEmail = (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: '"email" is required' });
    }

    if (isEmailValid(email) === false) {
      return res.status(400).json({ message: '"email" must be a valid email' });
    }

    next();
  } catch (err) {
    console.error(err);
  }
};

const checkPassword = (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ message: '"password" is required' });
    }

    if (password.length !== 6) {
      return res.status(400).json({ message: '"password" length must be 6 characters long' });
    }

    next();
  } catch (err) {
    console.error(err);
  } 
};

module.exports = {
  validateToken,
  displayNameBiggerThan,
  checkEmail,
  checkPassword,
  validateUser,
};