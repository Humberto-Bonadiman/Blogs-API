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
