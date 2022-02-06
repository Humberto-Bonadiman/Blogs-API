<<<<<<< HEAD
require('dotenv').config();

const jwt = require('jsonwebtoken');
const { User } = require('../models');

const { JWT_SECRET } = process.env;

module.exports = async (req, res) => {
  try {
    const { displayName, email, password, image } = req.body;
    const user = await User.create(displayName, email, password, image);
    const jwtConfig = {
      expiresIn: '7d',
      algorithm: 'HS256',
    };

    const token = jwt.sign({ username: user.email }, JWT_SECRET, jwtConfig);

    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};
=======
const express = require('express');
const userService = require('../services/usersServices');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { displayName, email, password, image } = req.body;
    const response = await userService.create({ displayName, email, password, image });

    return res.status(201).json(response);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: 'Algo deu errado' });
  }
});

module.exports = router;
>>>>>>> 8e187dee312f4a29c51506c695d0b466f897dcae
