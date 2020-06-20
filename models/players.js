module.exports = function(sequelize, DataTypes) {
    const Player = sequelize.define("Player", {
      // Giving the Author model a name of type STRING
      name: DataTypes.STRING
    });
  
    // Player.associate = function(models) {
    //   // Associating Author with Posts
    //   // When an Author is deleted, also delete any associated Posts
    //   Player.hasMany(models.Post, {
    //     onDelete: "cascade"
    //   });
    // };
  
    return Player;
  };
  