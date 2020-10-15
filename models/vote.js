// Dependencies
const bcrypt = require("bcryptjs");

module.exports = function (sequelize, DataTypes) {
  // Creates a "Character" model that matches up with DB
  const Vote = sequelize.define("Vote", {
    name: { type: DataTypes.INTEGER, allowNull: false },
    choose: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  });
  Vote.associate = function (models) {
    Vote.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Vote;
};
