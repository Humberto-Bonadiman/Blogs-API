const { createUser } = require('../controllers/userController');
const loginController = require('../controllers/loginController');
const { getAllUser } = require('../controllers/userController');
const { getUserById } = require('../controllers/userController');
const { createCategory } = require('../controllers/categoriesController');

module.exports = {
  createUser,
  loginController,
  getAllUser,
  getUserById,
  createCategory,
};