require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes.js');
const { 
  validateDisplay,
  emailExist,
  validateEmail,
  userEmail,
  emailNotEmpty,
  notUserEmail,
  validatePassword,
  passwordExist,
  passwordNotEmpty,
  // validateUser,
} = require('../middlewares/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apiRoutes = express.Router();

apiRoutes.post(
  '/user',
  validateDisplay,
  emailExist,
  validateEmail,
  passwordExist,
  validatePassword,
  userEmail,
  routes.userController,
);

apiRoutes.post(
  '/login',
  emailExist,
  passwordExist,
  emailNotEmpty,
  passwordNotEmpty,
  notUserEmail,
  routes.loginController,
);

app.use(apiRoutes);

module.exports = app;