// const mongoose = require("mongoose");

// const TaskSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   status: { type: String, enum: ["todo", "inprogress", "done"], default: "todo" },
//   priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
//   groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   updatedAt: { type: Date, default: Date.now },
//   groupId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Group",
//     required: true,
//   },
//   activity: [
//     {
//       user: { type: String },
//       action: { type: String },
//       timestamp: { type: Date, default: Date.now }
//     }
//   ]

// });

// module.exports = mongoose.model("Task", TaskSchema);

const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ["todo", "inprogress", "done"], default: "todo" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  updatedAt: { type: Date, default: Date.now },
  activity: [
    {
      user: { type: String },
      action: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Task", TaskSchema);