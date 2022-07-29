require('dotenv').config();

const categoriesService = require('../service/categoriesService');

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await categoriesService.createCategory(name);

    return res.status(201).json(category);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const getAllCategories = async (_req, res) => {
  try {
    const categories = await categoriesService.getAllCategories();
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
};