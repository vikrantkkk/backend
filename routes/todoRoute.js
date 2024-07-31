const express = require("express");
const { todo, fetchAlltodo } = require("../controllers/todoController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/create-todo", authMiddleware, todo);
router.get("/fetch-all-todo", fetchAlltodo);

module.exports = router;
