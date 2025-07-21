const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String, 
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", ActivitySchema);
