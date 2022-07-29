require('dotenv').config();

const postService = require('../service/postService');

const createPost = async (req, res) => {
  try {
    const { title, content, categoryIds } = req.body;
    const token = req.headers.authorization;
  
    const post = await postService.createPost({ title, content, categoryIds }, token);

    return res.status(201).json({
      id: post.id,
      userId: post.userId,
      title: post.title,
      content: post.content,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const getAllPosts = async (_req, res) => {
  try {
    const allPosts = await postService.getAllPosts();

    return res.status(200).json(allPosts);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const getById = await postService.getPostById(id);

    return res.status(200).json(getById);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

const updatePostById = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const getById = await postService.getPostById(id, { title, content });

  return res.status(200).json(getById);
};

const deletePostById = async (req, res) => {
  const { id } = req.params;
  await postService.deletePostById(id);

  return res.status(204).end();
};

/* Fonte: Documentação Sequelize
  URL: https://sequelize.org/master/manual/model-querying-basics.html */

const getPostBySearch = async (req, res) => {
  const { q } = req.query;

  const getPostByQuery = await postService.getPostBySearch(q);

  return res.status(200).json(getPostByQuery);
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  getPostBySearch,
};