const express = require("express");
const {
  registerUser,
  login,
  verifyOpt,
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
router.get("/dashboard", authMiddleware, authrizerole, (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the dashboard!", userId: req.userId });
});

module.exports = router;
