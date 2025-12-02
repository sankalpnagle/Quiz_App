import express from "express";
import {
  getPublicQuizzes,
  getQuizForTaking,
  submitQuiz,
} from "../controllers/quizController.js";

const router = express.Router();

// Public – no auth required
router.get("/public", getPublicQuizzes);
router.get("/:id", getQuizForTaking);
router.post("/:id/submit", submitQuiz);

export default router;
