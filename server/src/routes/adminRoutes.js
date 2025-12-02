import express from "express";
import { getAllUsers } from "../controllers/adminController.js";
import { protect } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = express.Router();

// Only admin can access
router.get("/users", protect, requireRole("admin"), getAllUsers);

export default router;
