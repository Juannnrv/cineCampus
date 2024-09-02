const jwt = require("jsonwebtoken");
const User = require("../models/user");

const loginUser = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "missing credentials" });
  }

  try {
    const user = await User.findOne({ name: name, password: password });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Logged on", token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error finding user" });
  }
};

module.exports = { loginUser };