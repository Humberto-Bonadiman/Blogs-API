module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    displayName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
    tableName: 'Users',
  });

  Users.associate = (models) => {
    Users.hasMany(models.BlogPosts, {
      as: 'posts', foreignKey: 'userId',
    });
  };

  return Users;
};
