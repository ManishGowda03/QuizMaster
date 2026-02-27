import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { createQuiz, getQuizByTopic, getAllQuizzes  } from "../controllers/quizController.js";

const router = express.Router();

// Create Quiz (Admin only)
router.post("/", protect, adminOnly, createQuiz);
router.get("/", protect, getAllQuizzes);
router.get("/:topic", protect, getQuizByTopic);

export default router;