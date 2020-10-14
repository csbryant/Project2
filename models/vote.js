// Dependencies
const bcrypt = require("bcryptjs");

module.exports = function(sequelize, DataTypes) {
  // Creates a "Character" model that matches up with DB
  const Vote = sequelize.define("Vote", {
    choose: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  });
  return Vote;
};

