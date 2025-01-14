const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).json({ error: "Failed to register user" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error logging in:", err.message);
    res.status(500).json({ error: "Failed to log in" });
  }
};

const guestLogin = async (req, res) => {
  try {
    const guestUser = {
      id: "guest",
      username: "Guest User",
      role: "guest",
    };

    const token = jwt.sign(guestUser, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error logging in as guest:", err.message);
    res.status(500).json({ error: "Failed to log in as guest" });
  }
};

module.exports = { registerUser, loginUser, guestLogin };
