const Todo = require("../models/todoModel.js");
const User = require("../models/userModel.js");

exports.todo = async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.user;
    if (!title)
      return res.status(400).json({ message: "please fill the details" });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const todo = await Todo.create({ title, createdBy: user._id });
    res.status(201).json({ message: "Todo created successfully", todo });
  } catch (error) {
    console.log(error);
  }
};

exports.fetchAlltodo = async (req, res) => {
  try {
    const todo = await Todo.find();
    if (!todo || todo.length === 0) {
      return res.status(404).json({ message: "No Todos found" });
    }

    res.status(200).json({ message: "Todo fetched successfully", data: todo });
  } catch (error) {
    console.log(error);
  }
};
exports.fetchAlltodoByUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const todo = await Todo.find({ createdBy: user._id });
    console.log("🚀 ~ exports.fetchAlltodoByUser= ~ todo:", todo)
    res.status(200).json({ message: "Todo fetched successfully", data: todo });
  } catch (error) {
    console.log(error);
  }
};

