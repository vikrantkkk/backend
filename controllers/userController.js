const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOTPEmail = require("../email/email");
const sendEmail = require("../email/email");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

exports.registerUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "Please fill all the details" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ mesage: "invalid email format" });
    }
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ mesage: "invalid phone format" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ mesage: "invalid passowod format" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) res.status(400).json({ message: "user already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const optExpire = Date.now() + 10 * 60 * 60 * 1000;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const newUser = await User.create({
      name,
      phone,
      email,
      otp,
      optExpire,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true });

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: `
        <h1>Welcome to Our Platform, ${name}!</h1>
        <p>Thank you for registering. Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>
      `,
    });

    return res.status(200).json({
      message: "User registered successfully",
      data: newUser,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password))
      res.status(400).json({ message: "Please fill all the details" });
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ mesage: "invalid passowod format" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const decodePassword = await bcrypt.compare(password, user.password);
    if (!decodePassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true });
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    const otpExpire = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    user.otp = otp;
    user.optExpire = otpExpire;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: `
        <h1>Welcome to Our Platform,!</h1>
        <p>Thank you for registering. Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>
      `,
    });
    return res.status(200).json({
      message: "User logged in successfully",
      data: user,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyOpt = async (req, res) => {
  try {
    const { otp } = req.body;
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isActive = true;
    user.otp = undefined;
    user.optExpire = undefined;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const fetchAllUser = await User.find().select("-password");
    if (!fetchAllUser) {
      return res.status(404).json({ message: "No user found" });
    }
    return res
      .status(200)
      .json({ message: "All users fetched successfully", data: fetchAllUser });
  } catch (error) {
    console.log(error);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully", data: user });
  } catch (error) {
    console.log(error);
  }
};

exports.editUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const { id } = req.user ? req.user : req.params;
    let upadatedUser = { name, phone, email };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      upadatedUser.password = hashedPassword;
    }
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: upadatedUser,
      },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User updated successfully", data: user });
  } catch (error) {
    console.log(error);
  }
};

