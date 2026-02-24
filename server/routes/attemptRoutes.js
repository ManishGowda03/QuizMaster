import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { submitQuiz, getAttemptStats } from "../controllers/attemptController.js";

const router = express.Router();

router.post("/", protect, submitQuiz);
router.get("/:quizId", protect, getAttemptStats);

export default router;