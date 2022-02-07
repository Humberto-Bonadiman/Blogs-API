require('dotenv').config();

const jwt = require('jsonwebtoken');
const { Users } = require('../models');

const createUser = async (req, res) => {
  try {
    const { displayName, email, password, image } = req.body;
    const user = await Users.create({ displayName, email, password, image });
    if (!user) throw Error;
    const jwtConfig = {
      expiresIn: '7d',
      algorithm: 'HS256',
    };

    const token = jwt.sign({ data: user }, process.env.JWT_SECRET, jwtConfig);

    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const getAllUser = async (_req, res) => {
  try {
    const user = await Users.findAll({ attributes: { exclude: 'password' } });
    console.log(user);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

module.exports = {
  createUser,
  getAllUser,
};
