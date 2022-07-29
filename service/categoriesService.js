require('dotenv').config();

const jwt = require('jsonwebtoken');
const { Categories } = require('../models');

const createCategory = async (name) => {
  try {
    const category = await Categories.create({ name });
    if (!category) throw Error;
    const jwtConfig = {
      expiresIn: '7d',
      algorithm: 'HS256',
    };

    jwt.sign({ data: category }, process.env.JWT_SECRET, jwtConfig);

    return category;
  } catch (err) {
    throw Error;
  }
};

const getAllCategories = async () => {
  try {
    const categories = await Categories.findAll();
    return categories;
  } catch (err) {
    throw Error;
  }
};

module.exports = {
  createCategory,
  getAllCategories,
};