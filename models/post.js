module.exports = function(sequelize, DataTypes) {
    const Teams = sequelize.define("Teams", {
     team_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1,160]
        }
      },
      player_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        len: [1]
      }
    });
  
    Teams.associate = function(models) {
      // We're saying that a Post should belong to an Author
      // A Post can't be created without an Author due to the foreign key constraint
      Teams.belongsTo(models.Player, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return Teams;
  };
  