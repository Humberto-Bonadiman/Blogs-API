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
  validateToken,
  validateUser,
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
  routes.createUser,
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

apiRoutes.get('/user', validateToken, validateUser, routes.getAllUser);

app.use(apiRoutes);

module.exports = app;