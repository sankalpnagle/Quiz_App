import User from "../models/UserModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
