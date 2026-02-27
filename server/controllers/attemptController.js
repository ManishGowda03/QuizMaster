import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";

// ---------------- SUBMIT QUIZ ----------------
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    // 1️⃣ Find quiz
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;

    // 2️⃣ Calculate score
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

    // 3️⃣ Save attempt
    await QuizAttempt.create({
      user: req.user._id,
      quiz: quizId,
      answers,
      score,
    });

    // 4️⃣ Get all attempts
    const allAttempts = await QuizAttempt.find({
      user: req.user._id,
      quiz: quizId,
    }).sort({ createdAt: 1 }); // oldest first

    const attemptCount = allAttempts.length;

    const bestScore =
      attemptCount > 0
        ? Math.max(...allAttempts.map((a) => a.score))
        : 0;

    // 5️⃣ Send result
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
      attempts: allAttempts.map((a) => ({
        score: a.score,
        date: a.createdAt,
      })),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET ATTEMPT STATS ----------------
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