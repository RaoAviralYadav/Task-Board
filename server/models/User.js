// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });

// module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String, // image URL (optional)
    default: "", 
  },
});

module.exports = mongoose.model("User", UserSchema);

