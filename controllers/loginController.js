require('dotenv').config();

const loginService = require('../service/loginService');

module.exports = async (req, res) => {
  try {
    const { email } = req.body;

    const token = await loginService.create(email);

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};
