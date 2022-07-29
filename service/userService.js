require('dotenv').config();

const jwt = require('jsonwebtoken');
const { Users } = require('../models');

const createUser = async (body) => {
  try {
    const { displayName, email, password, image } = body;
    const user = await Users.create({ displayName, email, password, image });
    if (!user) throw Error;
    const jwtConfig = {
      expiresIn: '7d',
      algorithm: 'HS256',
    };

    const token = jwt.sign({ data: {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      image: user.image,
    } }, process.env.JWT_SECRET, jwtConfig);
    return token;
  } catch (err) {
    throw Error;
  }
};

const getAllUser = async () => {
  try {
    const user = await Users.findAll({ attributes: { exclude: 'password' } });
    console.log(user);
    return user;
  } catch (err) {
    throw Error;
  }
};

const getUserById = async (id) => {
  try {
    const userId = await Users.findOne({ where: { id }, attributes: { exclude: 'password' } });
    return userId;
  } catch (err) {
    throw Error;
  }
};

const deleteMeUser = async (token) => {
  try {
    const { data: { id } } = jwt.verify(token, process.env.JWT_SECRET);
    const deleteUser = await Users.destroy({ where: { id } });
    return deleteUser;
  } catch (err) {
    throw Error;
  }
};

module.exports = {
  createUser,
  getAllUser,
  getUserById,
  deleteMeUser,
};
