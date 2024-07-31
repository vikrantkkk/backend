const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const { subTodo } = require("../controllers/subTodoController.js");

const router = express.Router();

router.post("/create-subtodo/:todoId", authMiddleware, subTodo);

module.exports = router;
