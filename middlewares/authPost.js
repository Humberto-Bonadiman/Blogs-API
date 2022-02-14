const { Categories, BlogPosts } = require('../models');

const validateTitle = (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: '"title" is required' });
  }

  next();
};

const validateContent = (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: '"content" is required' });
  }

  next();
};

const validateCategoryIds = (req, res, next) => {
  const { categoryIds } = req.body;
  if (!categoryIds) {
    return res.status(400).json({ message: '"categoryIds" is required' });
  }
  next();
};

const categoryIdExist = async (req, res, next) => {
  const { categoryIds } = req.body;
  const lookCategory = await Categories.findAll({ where: { id: categoryIds } });
  if (lookCategory.length === 0) {
    return res.status(400).json({ message: '"categoryIds" not found' });
  }
  
  next();
};

const postNotExist = async (req, res, next) => {
  const { id } = req.params;
  const postId = await BlogPosts.findOne({ where: { id } });
  if (!postId) {
    return res.status(404).json({ message: 'Post does not exist' });
  }

  next();
};

module.exports = {
  validateTitle,
  validateContent,
  validateCategoryIds,
  categoryIdExist,
  postNotExist,
};