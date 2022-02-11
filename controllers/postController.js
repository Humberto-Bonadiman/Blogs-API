require('dotenv').config();
const jwt = require('jsonwebtoken');

const { BlogPosts, Users, Categories, PostsCategories } = require('../models');

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
    const post = await BlogPosts.create({ title, content, userId: id });
    
    const categoryPostsIds = categoryIds.map(async (categoryId) => {
      PostsCategories.create({ categoryId, postId: post.id });
    });

    await Promise.all(categoryPostsIds);

    return res.status(201).json(postObject(post));
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const getAllPosts = async (_req, res) => {
  try {
    const allPosts = await BlogPosts.findAll({
      include: [
        { model: Users, as: 'user', attributes: { exclude: 'password' } },
        { model: Categories, as: 'categories', through: { attributes: [] } },
      ],
    });

    return res.status(201).json(allPosts);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
};