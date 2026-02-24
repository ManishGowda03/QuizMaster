import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";

// Submit Quiz
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    // 1️ Find quiz
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;

    // 2️ Calculate score
    quiz.questions.forEach((question) => {
      const userAnswer = answers.find(
        (a) => a.questionId === question._id.toString()
      );

      if (
        userAnswer &&
        userAnswer.selectedOption === question.correctAnswer
      ) {
        score++;
      }
    });

    // 3️ Save attempt
    const attempt = await QuizAttempt.create({
      user: req.user._id,
      quiz: quizId,
      answers,
      score,
    });

    // 4️ Get attempt count
    const attemptCount = await QuizAttempt.countDocuments({
      user: req.user._id,
      quiz: quizId,
    });

    // 5️ Get best score
    const allAttempts = await QuizAttempt.find({
      user: req.user._id,
      quiz: quizId,
    });

    const bestScore = Math.max(...allAttempts.map((a) => a.score));

    // 6️ Send result
    res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions: quiz.questions.length,
      attemptCount,
      bestScore,
      correctAnswers: quiz.questions.map((q) => ({
        questionId: q._id,
        correctAnswer: q.correctAnswer,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Attempt Stats
export const getAttemptStats = async (req, res) => {
  try {
    const { quizId } = req.params;

    const attempts = await QuizAttempt.find({
      user: req.user._id,
      quiz: quizId,
    }).sort({ createdAt: -1 });

    const attemptCount = attempts.length;

    const bestScore =
      attemptCount > 0
        ? Math.max(...attempts.map((a) => a.score))
        : 0;

    const lastScore =
      attemptCount > 0
        ? attempts[0].score
        : 0;

    res.status(200).json({
      attemptCount,
      bestScore,
      lastScore,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};