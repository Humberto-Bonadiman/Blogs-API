require('dotenv').config();

const jwt = require('jsonwebtoken');
const { Users } = require('../models');

const create = async (email) => {
  try {
    const user = await Users.findOne({ where: { email } });

    const jwtConfig = {
      expiresIn: '7d',
      algorithm: 'HS256',
    };

    const token = jwt.sign({ data: user }, process.env.JWT_SECRET, jwtConfig);

    return token;
  } catch (err) {
    throw Error;
  }
};

module.exports = { create };
