import express from "express";
import Quiz from "../models/Quiz.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Quiz (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { topic, title, description, duration, questions } = req.body;

    const quiz = await Quiz.create({
      topic,
      title,
      description,
      duration,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;