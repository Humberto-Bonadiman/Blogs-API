require('dotenv').config();
const jwt = require('jsonwebtoken');

const { Users } = require('../models');

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

const emailExist = (req, res, next) => {
  const { email } = req.body;

  if (email === undefined) {
    return res.status(400).json({ message: '"email" is required' });
  }

  next();
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (isEmailValid(email) === false) {
    return res.status(400).json({ message: '"email" must be a valid email' });
  }

  next();
};

const userEmail = async (req, res, next) => {
  const { email } = req.body;
  const lookEmail = await Users.findOne({ where: { email } });

  if (lookEmail) {
    return res.status(409).json({ message: 'User already registered' });
  }

  next();
};

const emailNotEmpty = (req, res, next) => {
  const { email } = req.body;
  if (email === '') {
    return res.status(400).json({ message: '"email" is not allowed to be empty' });
  }

  next();
};

const notUserEmail = async (req, res, next) => {
  const { email } = req.body;
  const lookEmail = await Users.findOne({ where: { email } });

  if (!lookEmail) {
    return res.status(400).json({ message: 'Invalid fields' });
  }

  next();
};

const passwordExist = (req, res, next) => {
  const { password } = req.body;
  if (password === undefined) {
    return res.status(400).json({ message: '"password" is required' });
  }

  next();
};

const passwordNotEmpty = (req, res, next) => {
  const { password } = req.body;

  if (password === '') {
    return res.status(400).json({ message: '"password" is not allowed to be empty' });
  }

  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (password.length !== 6) {
    return res.status(400).json({ message: '"password" length must be 6 characters long' });
  }

  next();
};

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Token não encontrado' });
  }

  next();
};

const validateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findByPk(decoded.data.id);

    if (!user) {
      return res.status(401).json({ message: 'Expired or invalid token' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
};

module.exports = {
  validateDisplay,
  emailExist,
  validateEmail,
  userEmail,
  emailNotEmpty,
  notUserEmail,
  passwordExist,
  passwordNotEmpty,
  validatePassword,
  validateUser,
  validateToken,
};