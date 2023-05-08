const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  team_name: { type: String, required: true }, 
  description: { type: String, required: true },    
});

// Virtual for team's URL
TeamSchema.virtual("url").get(function () {
  return `/team/${this._id}`;
});

// Export model
module.exports = mongoose.model("Team", TeamSchema);
