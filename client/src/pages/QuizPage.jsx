import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const QuizPage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH QUIZ ----------------
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${topic}`);
        setQuiz(res.data);
        setTimeLeft(res.data.duration * 60);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [topic]);

  // ---------------- TIMER ----------------
  useEffect(() => {
    if (!quiz) return;

    // Auto submit when timer ends
    if (timeLeft <= 0 && !result) {
      handleSubmit(true);
      return;
    }

    if (timeLeft <= 0 || result) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, result, quiz]);

  // ---------------- OPTION SELECT ----------------
  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (auto = false) => {
    if (result || loading) return;

    // Confirm only for manual submission
    if (!auto) {
      const confirmSubmit = window.confirm(
        "Are you sure you want to submit the quiz?"
      );
      if (!confirmSubmit) return;
    }

    try {
      setLoading(true);

      const formattedAnswers = Object.keys(answers).map((id) => ({
        questionId: id,
        selectedOption: answers[id],
      }));

      const res = await api.post("/attempts", {
        quizId: quiz._id,
        answers: formattedAnswers,
      });

      setResult(res.data);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RETAKE ----------------
  const handleRetake = () => {
    setAnswers({});
    setResult(null);
    setTimeLeft(quiz.duration * 60);
  };

  if (!quiz)
    return <div className="text-white p-6">Loading quiz...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>

      {/* ---------------- TIMER ---------------- */}
      {!result && (
        <p className="mb-4 text-red-400">
          Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </p>
      )}

      {/* ---------------- PROGRESS BAR ---------------- */}
      {!result && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">
            Progress: {Object.keys(answers).length} /{" "}
            {quiz.questions.length} answered
          </p>

          <div className="w-full bg-slate-700 h-3 rounded-full">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (Object.keys(answers).length /
                    quiz.questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      )}

      {/* ---------------- RESULT SECTION ---------------- */}
      {result && (
        <div className="mb-6 bg-green-700 p-4 rounded-xl transition-all duration-500">
          <h2 className="text-xl font-bold mb-2">
            Your Score: {result.score}/{result.totalQuestions}
          </h2>

          <p>Attempt Count: {result.attemptCount}</p>
          <p className="mb-4">
            Best Score:{" "}
            <span className="font-bold">{result.bestScore}</span>
          </p>

          <div className="bg-slate-800 p-4 rounded-xl mt-4">
            <h3 className="font-semibold mb-2">
              Attempt History
            </h3>

            {result.attempts.map((attempt, index) => (
              <div
                key={index}
                className={`mb-1 p-2 rounded ${
                  attempt.score === result.bestScore
                    ? "bg-yellow-600"
                    : "bg-slate-700"
                }`}
              >
                Attempt {index + 1} → {attempt.score}/
                {result.totalQuestions}
                {attempt.score === result.bestScore && " ⭐"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- QUESTIONS ---------------- */}
      {quiz.questions.map((q, index) => (
        <div
          key={q._id}
          className="mb-6 bg-slate-800 p-4 rounded-xl transition-all duration-300 hover:scale-[1.01]"
        >
          <h2 className="font-semibold mb-2">
            {index + 1}. {q.question}
          </h2>

          {q.options.map((option, i) => {
            const correctAnswer = result?.correctAnswers.find(
              (c) => c.questionId === q._id
            )?.correctAnswer;

            return (
              <label
                key={i}
                className={`block mb-2 cursor-pointer p-2 rounded ${
                  result
                    ? i === correctAnswer
                      ? "bg-green-600"
                      : answers[q._id] === i
                      ? "bg-red-600"
                      : ""
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name={q._id}
                  className="mr-2"
                  disabled={!!result}
                  checked={answers[q._id] === i}
                  onChange={() =>
                    handleOptionChange(q._id, i)
                  }
                />
                {option}
              </label>
            );
          })}
        </div>
      ))}

      {/* ---------------- BUTTONS ---------------- */}
      <div className="mt-4">
        {!result && (
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="bg-green-600 px-6 py-2 rounded-xl hover:bg-green-500 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>
        )}

        {result && (
          <>
            <button
              onClick={handleRetake}
              className="bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-500"
            >
              Retake Quiz
            </button>

            <button
              onClick={() => navigate("/")}
              className="ml-4 bg-gray-600 px-6 py-2 rounded-xl hover:bg-gray-500"
            >
              Back to Topics
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPage;