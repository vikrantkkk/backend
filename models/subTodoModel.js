const mongoose = require("mongoose");

const subTodoSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
    },
    priroty: {
      type: String,
      default: "low",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const SubTodo = mongoose.model("SubTodo", subTodoSchema);
module.exports = SubTodo;
