require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes.js');
const { 
  validateDisplay,
  validateEmail,
  validatePassword,
  // validateUser,
} = require('../middlewares/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apiRoutes = express.Router();

apiRoutes.post(
  '/user',
  validateDisplay,
  validateEmail,
  validatePassword,
  routes.userController,
);

app.use(apiRoutes);

module.exports = app;