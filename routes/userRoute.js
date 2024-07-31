const express = require("express");
const {
  registerUser,
  login,
  verifyOpt,
  getAllUser,
  getUserById,
  editUser,
} = require("../controllers/userController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const authrizerole = require("../middleware/authrizeRole.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/verify-otp", authMiddleware, verifyOpt);
router.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
  }
});
router.get("/fetch-alluser", authMiddleware, getAllUser);
router.get("/fetch-user-by-id/:id", authMiddleware, getUserById);
router.post("/fetch-edituser-by-id", authMiddleware, editUser);
router.post("/fetch-edituser-by-id/:id", authMiddleware, editUser);
module.exports = router;
