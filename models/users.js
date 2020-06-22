module.exports = function(sequelize, DataTypes) {
    const Users = sequelize.define("user_table", {
     user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1,160]
        }
      }
    });
  
    Users.associate = function(models) {
      // We're saying that a Post should belong to an Author
      // A Post can't be created without an Author due to the foreign key constraint
      Users.belongsTo(models.Player, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return Users;
  };
  