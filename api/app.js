require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes.js');
const auth = require('../middlewares/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apiRoutes = express.Router();

apiRoutes.post(
  '/user',
  auth.validateDisplay,
  auth.emailExist,
  auth.validateEmail,
  auth.passwordExist,
  auth.validatePassword,
  auth.userEmail,
  routes.createUser,
);

apiRoutes.post(
  '/login',
  auth.emailExist,
  auth.passwordExist,
  auth.emailNotEmpty,
  auth.passwordNotEmpty,
  auth.notUserEmail,
  routes.loginController,
);

apiRoutes.get(
  '/user',
  auth.validateToken,
  auth.validateUser,
  routes.getAllUser,
);

app.use(apiRoutes);

module.exports = app;