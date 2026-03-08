import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { createQuiz, getQuizByTopic, getAllQuizzes, getQuizById, updateQuiz, deleteQuiz  } from "../controllers/quizController.js";

const router = express.Router();

// Create Quiz (Admin only)
router.post("/", protect, adminOnly, createQuiz);
router.get("/", protect, getAllQuizzes);
router.get("/id/:id", protect, adminOnly, getQuizById);
router.get("/:topic", protect, getQuizByTopic);
router.put("/:id", protect, adminOnly, updateQuiz);
router.delete("/:id", protect, adminOnly, deleteQuiz);

export default router;