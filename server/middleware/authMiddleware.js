// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../src/models/UserModel.js"; // adjust the path if needed

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    // Debug: check what header you’re actually getting
    console.log("Authorization header:", authHeader);

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1]; // only token, no 'Bearer'
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verify error:", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
