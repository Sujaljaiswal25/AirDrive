const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.user = decoded; // decoded payload (id, email, role)
    next();
  });
};


const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken; // Refresh token mostly cookies me hota hai

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided." });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token." });
    }

    req.user = decoded;
    next();
  });
};


const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access Denied. Insufficient permissions." });
    }
    next();
  };
};



// Protect middleware
const protect = async (req, res, next) => {
  let token;

  // Token mostly "Bearer <token>" format me aata hai
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // DB se fresh user data nikalna
    const user = await userModel.findById(decoded.id).select("-password"); // password exclude

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // req.user me complete user save
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};




module.exports = {
    checkRole,
    verifyRefreshToken,
    verifyToken,
    protect
}