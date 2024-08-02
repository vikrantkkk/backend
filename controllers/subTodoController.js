const User = require("../models/userModel.js");
const subTodo = require("../models/subTodoModel.js");
const Todo = require("../models/todoModel.js");
const SubTodo = require("../models/subTodoModel.js");
const mongoose = require("mongoose");

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

exports.fetchAllSubtodo = async (req, res) => {
  try {
    const subTodo = await SubTodo.find();
    if (!subTodo || subTodo.length === 0) {
      return res.status(404).json({ message: "No subTodo   found" });
    }

    res
      .status(200)
      .json({ message: "subTodo fetched successfully", data: subTodo });
  } catch (error) {
    console.log(error);
  }
};
//populate
// exports.fetchAllSubtodoByUser = async (req,res) => {
//   try {
//     const { id } = req.user;
//     const user = await User.findById(id);
//     if (!user) return res.status(404).json({ message: "User not found"});
//     const subTodos = await subTodo.find({createdBy:user._id}).populate('createdBy')
//     res.status(200).json({subTodos})
//   } catch (error) {
//     console.log(error);
//   }
// };

//aggragation
// exports.fetchAllSubtodoByUser = async (req, res) => {
//   try {
//     const { id } = req.user; // Assuming you have an authenticated user

//     const subTodos = await SubTodo.aggregate([
//       // Match subTodos created by the specific user
//       {
//         $match: {
//           createdBy: new mongoose.Types.ObjectId(id), // Use 'new' with ObjectId
//         },
//       },
//       // Lookup to fetch user details
//       {
//         $lookup: {
//           from: "users", // Collection name for users
//           localField: "createdBy",
//           foreignField: "_id",
//           as: "userDetails",
//         },
//       },
//       // Unwind userDetails to handle as individual documents
//       {
//         $unwind: {
//           path: "$userDetails",
//           preserveNullAndEmptyArrays: true, // Preserve if there are no userDetails
//         },
//       },
//       // Project to include only required fields
//       {
//         $project: {
//           task: 1,
//           completed: 1,
//           userName: "$userDetails.name",
//           userEmail: "$userDetails.email",
//           // Include other fields you want
//           // _id: 1,  // Example of including _id
//         },
//       },
//     ]);

//     if (!subTodos || subTodos.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No SubTodos found for this user" });
//     }

//     res
//       .status(200)
//       .json({ message: "SubTodos fetched successfully", subTodos });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
exports.fetchAllSubtodoByUser = async (req, res) => {
  try {
    const id = req.user;
    const user = await SubTodo.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: "$userDetails.name",
          phone: "$userDetails.phone",
          email: "$userDetails.email",
          task:1,
          completed: 1,
        },
      },
    ]);

    return res.status(200).json({message:"subTodo find Successfully", data: user });
  } catch (error) {
    console.log(error);
  }
};

exports.getallSubtodofSeperatetodo = async (req, res) => {
  try {
    const { id } = req.params;
    const getallSeperateSubtodo = await Todo.findById(id)
      .populate("subTodos")
      .exec();
    if (!getallSeperateSubtodo)
      return res.status(404).json({ message: "subTodos not found" });
    res.status(200).json({
      message: "subTodos fetched successfully",
      data: getallSeperateSubtodo,
    });
  } catch (error) {
    console.log(error);
  }
};
