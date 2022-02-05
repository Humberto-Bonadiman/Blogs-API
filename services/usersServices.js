const jwt = require('jsonwebtoken');
const userModel = require('../models');
require('dotenv').config();

const jwtConfig = {
  algorithm: 'HS256',
};

const secret = process.env.JWT_KEY;

const generateToken = (data, secret, config) => {
  const token = jwt.sign(data, secret, config);
  return token;
};

const create = async ({ displayName, email, password, image }) => {
  await userModel.create(displayName, email, password, image);
  const token = generateToken({ user: displayName }, secret, jwtConfig);
};

/* const create = async ({ name, quantity }) => {
  const product = await ProductModel.create(name, quantity);

  if (!product) return null;

  return {
    id: product.id,
    name,
    quantity,
  };
}; */

module.exports = {
  create,
};