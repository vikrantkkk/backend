const express = require("express");
const {
  todo,
  fetchAlltodo,
  fetchAlltodoByUser,
} = require("../controllers/todoController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/create-todo", authMiddleware, todo);
router.get("/fetch-all-todo", fetchAlltodo);
router.get("/fetchalltodobyuser", fetchAlltodoByUser);

module.exports = router;
