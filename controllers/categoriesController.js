require('dotenv').config();

const jwt = require('jsonwebtoken');
const { Categories } = require('../models');

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Categories.create({ name });
    if (!category) throw Error;
    const jwtConfig = {
      expiresIn: '7d',
      algorithm: 'HS256',
    };

    jwt.sign({ data: category }, process.env.JWT_SECRET, jwtConfig);

    return res.status(201).json(category);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const getAllCategories = async (_req, res) => {
  try {
    const categories = await Categories.findAll();
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
};