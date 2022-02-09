require('dotenv').config();
const jwt = require('jsonwebtoken');

const { BlogPosts } = require('../models');

function postObject(object) {
  return {
    id: object.id,
    userId: object.userId,
    title: object.title,
    content: object.content,
  };
}

const createPost = async (req, res) => {
  try {
    const { title, content, categoryIds } = req.body;
    const token = req.headers.authorization;
  
    const { data: { id } } = jwt.verify(token, process.env.JWT_SECRET);
    const post = await BlogPosts.create({ title, content, userId: id, categoryIds });

    return res.status(201).json(postObject(post));
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

module.exports = {
  createPost,
};