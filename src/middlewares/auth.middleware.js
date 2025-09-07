const jwt = require("jsonwebtoken");

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


module.exports = {
    checkRole,
    verifyRefreshToken,
    verifyToken
}