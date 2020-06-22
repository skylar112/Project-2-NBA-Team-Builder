module.exports = function (sequelize, DataTypes) {
  const Player = sequelize.define("Player_team_table", {
    // Giving the Author model a name of type STRING
    team_name: DataTypes.STRING,
    name_id: DataTypes.INTEGER,

    playersArray: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
          return this.getDataValue('playersArray').split(';')
      },
      set(val) {
         this.setDataValue('playersArray',val.join(';'));
      },
  }
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