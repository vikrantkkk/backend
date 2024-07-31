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
