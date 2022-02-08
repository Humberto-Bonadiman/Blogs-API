const { createUser } = require('../controllers/userController');
const loginController = require('../controllers/loginController');
const { getAllUser } = require('../controllers/userController');
const { getUserById } = require('../controllers/userController');

module.exports = {
  createUser,
  loginController,
  getAllUser,
  getUserById,
};