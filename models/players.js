module.exports = function (sequelize, DataTypes) {
  const player = sequelize.define("player", {
    // Giving the Author model a name of type STRING
    player_name: DataTypes.STRING,
    user_id: DataTypes.STRING,
  });
// add the userId to the player model

  player.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    player.belongsTo(models.Team, {
      foreignKey: {
        allowNull:true
      }
    });
};
  return player;
};
