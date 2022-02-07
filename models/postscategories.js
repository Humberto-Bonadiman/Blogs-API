module.exports = (sequelize, _DataTypes) => {
  const PostsCategories = sequelize.define('PostsCategories', {}, { timestamps: false });
  PostsCategories.associate = (models) => {
    models.Categories.belongsToMany(models.BlogPosts, {
      as: 'blogPosts',
      through: PostsCategories,
      foreignKey: 'id',
      otherKey: 'categoryId',
    });
    models.BlogPosts.belongsToMany(models.Categories, {
      as: 'Categories',
      through: PostsCategories,
      foreignKey: 'id',
      otherKey: 'postId',
    });
  };
  return PostsCategories;
};
