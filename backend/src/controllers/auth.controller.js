const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");

// Helper function: generate tokens
const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role || "user",
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// ================== REGISTER ==================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isUserExist = await userModel.findOne({ email });
    if (isUserExist)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle optional avatar
    let avatarUrl =
      "https://i.pinimg.com/1200x/4e/7c/53/4e7c53e7d136ab654ec3b004eeec3e72.jpg"; // default avatar
    if (req.file) {
      // const avatarResult = await uploadFile(req.file.buffer, Date.now() + "-avatar.png");
      // avatarUrl = avatarResult.url;
    }

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    const tokens = generateTokens(newUser);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // remove password before sending response
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res
      .status(201)
      .json({ user: userWithoutPassword, accessToken: tokens.accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== LOGIN ==================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const tokens = generateTokens(user);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // remove password before sending response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res
      .status(200)
      .json({ user: userWithoutPassword, accessToken: tokens.accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== LOGOUT ==================
const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== REFRESH TOKEN ==================
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, logout, refreshToken };
