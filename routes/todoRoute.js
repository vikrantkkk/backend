const express = require("express");
const { todo } = require("../controllers/todoController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/create-todo", authMiddleware, todo);

module.exports = router;
