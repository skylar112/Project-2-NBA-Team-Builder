module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define("user", {
     name: {
        type: DataTypes.STRING,
     
      }
    });
  
    // User.associate = function(Models) {
    //   // We're saying that a Post should belong to an Author
    //   // A Post can't be created without an Author due to the foreign key constraint
    //   User.belongsTo(Models.Player, {
    //     foreignKey: {
    //       allowNull: false
    //     }
    //   });
    // };
  
    return User;
  };
  