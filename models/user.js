const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_id: { type: String, required: true },  
  password: { type: String, required: true }, 
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true, minLength: 10, maxLength:10 },
  type: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user"
  },
  team: { type: Schema.Types.ObjectId, ref: "Team" },
});

// Virtual for user's full name
UserSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.last_name) {
    fullname = `${this.last_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.last_name) {
    fullname = "";
  }
  return fullname;
});

// Virtual for user's URL
UserSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
