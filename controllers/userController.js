require('dotenv').config();

const userService = require('../service/userService');

const createUser = async (req, res) => {
  try {
    const { displayName, email, password, image } = req.body;
    const token = await userService.createUser({ displayName, email, password, image });
    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const getAllUser = async (_req, res) => {
  try {
    const user = await userService.getAllUser();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await userService.getUserById(id);
    return res.status(200).json(userId);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const deleteMeUser = async (req, res) => {
  try {
    const token = req.headers.authorization;
    userService.deleteMeUser(token);

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
