import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";
import {
  createQuiz,
  getAllQuizzesAdmin,
  getQuizByIdAdmin,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";

const router = express.Router();

// All admin quiz routes require admin role
router.use(protect, requireRole("admin"));

router.post("/quizzes", createQuiz);
router.get("/quizzes", getAllQuizzesAdmin);
router.get("/quizzes/:id", getQuizByIdAdmin);
router.put("/quizzes/:id", updateQuiz);
router.delete("/quizzes/:id", deleteQuiz);

export default router;

