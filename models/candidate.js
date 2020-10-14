// Dependencies
const bcrypt = require("bcryptjs");

module.exports = function(sequelize, DataTypes) {
  // Creates a "Character" model that matches up with DB
  const Candidate = sequelize.define("Candidate", {
    name: { type: DataTypes.INTEGER, allowNull: false },
    vote: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  });
  return Candidate;
};
