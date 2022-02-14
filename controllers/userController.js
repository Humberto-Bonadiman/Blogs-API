require('dotenv').config();

const jwt = require('jsonwebtoken');
const { Users } = require('../models');

function secureUser(object) {
  return {
    id: object.id,
    displayName: object.displayName,
    email: object.email,
    image: object.image,
  };
}

const createUser = async (req, res) => {
  try {
    const { displayName, email, password, image } = req.body;
    const user = await Users.create({ displayName, email, password, image });
    if (!user) throw Error;
    const jwtConfig = {
      expiresIn: '7d',
      algorithm: 'HS256',
    };

    const token = jwt.sign({ data: secureUser(user) }, process.env.JWT_SECRET, jwtConfig);
    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const getAllUser = async (_req, res) => {
  try {
    const user = await Users.findAll({ attributes: { exclude: 'password' } });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await Users.findOne({ where: { id }, attributes: { exclude: 'password' } });
    return res.status(200).json(userId);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const deleteMeUser = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { data: { id } } = jwt.verify(token, process.env.JWT_SECRET);
    await Users.destroy({ where: { id } });

    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

module.exports = {
  createUser,
  getAllUser,
  getUserById,
  deleteMeUser,
};
