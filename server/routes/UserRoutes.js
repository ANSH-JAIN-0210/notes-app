const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const SECRET_KEY = '8882345228'; 

const generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '3h' });
};

router.post("/signup", async (req, res) => {
  const { name, username, email, phone, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: "User Already Exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, email, phone, password: hashedPassword });

    await newUser.save();
    const token = generateToken(newUser._id);
    res.status(201).json({ message: "SignUp Successful", token });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User Not Found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Invalid Password" });

    const token = generateToken(user._id);
    res.status(200).json({ message: "SignIn Successful", token });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
