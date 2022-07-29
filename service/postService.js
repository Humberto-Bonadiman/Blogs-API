require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const { BlogPosts, Users, Categories, PostsCategories } = require('../models');

const createPost = async (body, token) => {
  try {
    const { title, content, categoryIds } = body;
  
    const { data: { id } } = jwt.verify(token, process.env.JWT_SECRET);
    const post = await BlogPosts.create({ title, content, userId: id });
    
    const categoryPostsIds = categoryIds.map(async (categoryId) => {
      PostsCategories.create({ categoryId, postId: post.id });
    });

    await Promise.all(categoryPostsIds);

    return post;
  } catch (err) {
    throw Error;
  }
};

const getAllPosts = async () => {
  try {
    const allPosts = await BlogPosts.findAll({
      include: [
        { model: Users, as: 'user', attributes: { exclude: 'password' } },
        { model: Categories, as: 'categories', through: { attributes: [] } },
      ],
    });

    return allPosts;
  } catch (err) {
    throw Error;
  }
};

const getPostById = async (id) => {
  try {
    const getById = await BlogPosts.findOne({
      where: { id },
      include: [
        { model: Users, as: 'user', attributes: { exclude: 'password' } },
        { model: Categories, as: 'categories', through: { attributes: [] } },
      ],
    });

    return getById;
  } catch (err) {
    throw Error;
  }
};

const updatePostById = async (id, body) => {
  const { title, content } = body;
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

  return getById;
};

const deletePostById = async (id) => {
  const deletePost = await BlogPosts.destroy({ where: { id } });

  return deletePost;
};

/* Fonte: Documentação Sequelize
  URL: https://sequelize.org/master/manual/model-querying-basics.html */

const getPostBySearch = async (q) => {
  const getPostByQuery = await BlogPosts.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } },
      ],
    },
    include: [
      { model: Users, as: 'user', attributes: { exclude: 'password' } },
      { model: Categories, as: 'categories', through: { attributes: [] } },
    ],
  });

  return getPostByQuery;
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  getPostBySearch,
};