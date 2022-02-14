require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes.js');
const auth = require('../middlewares/auth');
const authCategories = require('../middlewares/authCategories');
const authPost = require('../middlewares/authPost');

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

apiRoutes.get(
  '/user/:id',
  auth.validateToken,
  auth.validateUser,
  auth.userNotExist,
  routes.getUserById,
);

apiRoutes.post(
  '/categories',
  authCategories.validateName,
  auth.validateToken,
  auth.validateUser,
  routes.createCategory,
);

apiRoutes.get(
  '/categories',
  auth.validateToken,
  auth.validateUser,
  routes.getAllCategories,
);

apiRoutes.post(
  '/post',
  authPost.validateTitle,
  authPost.validateContent,
  authPost.validateCategoryIds,
  auth.validateToken,
  auth.validateUser,
  authPost.categoryIdExist,
  routes.createPost,
);

apiRoutes.get(
  '/post',
  auth.validateToken,
  auth.validateUser,
  routes.getAllPosts,
);

apiRoutes.get(
  '/post/:id',
  auth.validateToken,
  auth.validateUser,
  authPost.postNotExist,
  routes.getPostById,
);

apiRoutes.put(
  '/post/:id',
  authPost.categoryIdCannotChange,
  auth.validateToken,
  auth.validateUser,
  authPost.validateTitle,
  authPost.validateContent,
  authPost.sameUser,
  routes.updatePostById,
);

apiRoutes.delete(
  '/post/:id',
  auth.validateToken,
  auth.validateUser,
  authPost.postNotExist,
  authPost.sameUser,
  routes.deletePostById,
);

apiRoutes.delete(
  '/user/me',
  auth.validateToken,
  auth.validateUser,
  routes.deleteMeUser,
);

app.use(apiRoutes);

module.exports = app;