module.exports = function (sequelize, DataTypes) {
  const Team = sequelize.define("Team", {
    
   
    // Giving the Author model a name of type STRING
    team_name: DataTypes.STRING,
    name_id: DataTypes.INTEGER,

  });

  Team.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Team.hasMany(models.player, {
      onDelete: "cascade"
    });
  };

  return Team;











};
