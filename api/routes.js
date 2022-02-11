const { createUser } = require('../controllers/userController');
const loginController = require('../controllers/loginController');
const { getAllUser } = require('../controllers/userController');
const { getUserById } = require('../controllers/userController');
const { createCategory } = require('../controllers/categoriesController');
const { getAllCategories } = require('../controllers/categoriesController');
const { createPost } = require('../controllers/postController');
const { getAllPosts } = require('../controllers/postController');

module.exports = {
  createUser,
  loginController,
  getAllUser,
  getUserById,
  createCategory,
  getAllCategories,
  createPost,
  getAllPosts,
};