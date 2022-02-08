/* require('dotenv').config();
const jwt = require('jsonwebtoken');

const { Categories } = require('../models');

const validateCategory = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const category = await Categories.findByPk(decoded.data.id);

    if (!category) {
      return res.status(401).json({ message: 'Expired or invalid token' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
}; */

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: '"name" is required' });
  }

  next();
};

module.exports = {
  // validateCategory,
  validateName,
};