const User = require("../models/userModel.js");
const subTodo = require("../models/subTodoModel.js");
const Todo = require("../models/todoModel.js");

exports.subTodo = async (req, res) => {
  try {
    const { task } = req.body;
    const { id } = req.user;
    const { todoId } = req.params;
    if (!task)
      return res.status(400).json({ message: "please fill the details" });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    const newSubTodo = await subTodo.create({ task, createdBy: user._id });
    todo.subTodos.push(newSubTodo._id);
    await todo.save();
    res
      .status(201)
      .json({ message: "subTodo created successfully", newSubTodo });
  } catch (error) {
    console.log(error);
  }
};
