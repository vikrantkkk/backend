const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const { subTodo, fetchAllSubtodo, fetchAllSubtodoByUser, getallSubtodofSeperatetodo } = require("../controllers/subTodoController.js");

const router = express.Router();

router.post("/create-subtodo/:todoId", authMiddleware, subTodo);
router.get("/fetch-allsubtodo/", authMiddleware, fetchAllSubtodo);
router.get("/fetchallsubtodobyuser/", authMiddleware, fetchAllSubtodoByUser);
router.get("/fetchallsubtodofseperatetodo/:id",authMiddleware, getallSubtodofSeperatetodo);

module.exports = router;
