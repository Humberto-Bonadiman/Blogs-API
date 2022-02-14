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

    return res.status(200).json(allPosts);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const getById = await BlogPosts.findOne({
      where: { id },
      include: [
        { model: Users, as: 'user', attributes: { exclude: 'password' } },
        { model: Categories, as: 'categories', through: { attributes: [] } },
      ],
    });

    return res.status(200).json(getById);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const updatePostById = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  await BlogPosts.update(
    { title, content },
    { where: { id } },
  );

  const getById = await BlogPosts.findOne({
    where: { id },
    include: [
      { model: Categories, as: 'categories', through: { attributes: [] } },
    ],
    attributes: { exclude: ['id', 'published', 'updated'] },
  });

  return res.status(200).json(getById);
};

const deletePostById = async (req, res) => {
  const { id } = req.params;
  await BlogPosts.destroy({ where: { id } });

  return res.status(204).end();
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
};