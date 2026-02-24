// controllers/quizController.js
import Quiz from "../models/Quiz.js";

// Admin: Create Quiz
export const createQuiz = async (req, res) => {
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
};

export const getQuizByTopic = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      topic: req.params.topic,
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Remove correctAnswer before sending
    const safeQuiz = {
      _id: quiz._id,
      topic: quiz.topic,
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        question: q.question,
        options: q.options,
      })),
    };

    res.status(200).json(safeQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};