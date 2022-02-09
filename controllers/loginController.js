require('dotenv').config();

const jwt = require('jsonwebtoken');
const { Users } = require('../models');

module.exports = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await Users.findOne({ where: { email } });

    const jwtConfig = {
      expiresIn: '7d',
      algorithm: 'HS256',
    };

    const token = jwt.sign({ data: user }, process.env.JWT_SECRET, jwtConfig);

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};
