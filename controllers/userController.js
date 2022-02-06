require('dotenv').config();

const jwt = require('jsonwebtoken');
const { Users } = require('../models');

const { JWT_SECRET } = process.env;

module.exports = async (req, res) => {
  try {
    const { displayName, email, password, image } = req.body;
    const user = await Users.create({ displayName, email, password, image });
    // console.log(user);
    const jwtConfig = {
      expiresIn: '7d',
      algorithm: 'HS256',
    };

    const token = jwt.sign({ username: user.dataValues.email }, JWT_SECRET, jwtConfig);

    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};
