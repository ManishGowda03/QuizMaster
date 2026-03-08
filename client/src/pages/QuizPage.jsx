import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import QuizTimer from "../components/QuizTimer";
import Confetti from "react-confetti";
import { toast } from "react-toastify";

const QuizPage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const answeredCount = Object.keys(answers).length;
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  /* Window resize for confetti */
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Fetch Quiz */
  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await api.get(`/quizzes/${topic}`);
      setQuiz(res.data);
      setTimeLeft(res.data.duration * 60);
    };

    fetchQuiz();
  }, [topic]);

  /* Timer */
  useEffect(() => {
    if (!quiz) return;

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

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async (auto = false) => {
  if (result || loading) return;

  // Prevent manual submit if not all questions answered
  if (!auto && answeredCount !== quiz.questions.length) {
    alert("Please answer all questions before submitting the quiz.");
    return;
  }

  if (!auto) {
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the quiz?"
    );
    if (!confirmSubmit) return;
  }

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
  toast.success("Quiz submitted!");
  setLoading(false);
};

  const handleRetake = () => {
    setAnswers({});
    setResult(null);
    setTimeLeft(quiz.duration * 60);
  };

  if (!quiz) {
    return (
      <div className="p-10 text-center text-gray-700">
        Loading quiz...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-slate-100 to-emerald-100 py-10">

      {/* Confetti for Perfect Score */}
      {result && result.score === result.totalQuestions && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={300}
          recycle={false}
        />
      )}

      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-3xl font-bold mb-6 text-gray-800 tracking-tight select-none">
          {quiz.title}
        </h1>

        {/* TIMER */}
        {!result && (
          <QuizTimer
            duration={quiz.duration * 60}
            timeLeft={timeLeft}
          />
        )}

        {/* PROGRESS */}
        {!result && (
          <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
            <p className="text-sm text-gray-500 mb-2">
              Progress: {Object.keys(answers).length} / {quiz.questions.length}
            </p>

            <div className="w-full bg-gray-200 h-3 rounded-full">
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

        {/* RESULT */}
        {result && (
          <div className="bg-white p-6 rounded-xl shadow border mb-6">

            <h2 className="text-xl font-bold mb-2">
              Score:
              <span className="text-green-600 ml-2">
                {result.score}/{result.totalQuestions}
              </span>
            </h2>

            <p>Attempt Count: {result.attemptCount}</p>
            <p>Best Score: {result.bestScore}</p>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="mt-4 text-blue-600 font-medium"
            >
              Attempt History ▼
            </button>

            {showHistory && (
              <div className="mt-3 border rounded-lg p-3 bg-gray-50">
                {result.attempts.map((attempt, index) => (
                  <div key={index} className="py-1">
                    Attempt {index + 1} → {attempt.score}/{result.totalQuestions}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* QUESTIONS */}
        {quiz.questions.map((q, index) => (
          <div
            key={q._id}
            className="mb-6 bg-white p-6 rounded-xl border shadow-sm"
          >

            <h2 className="font-semibold mb-4 text-lg whitespace-pre-line">
              {index + 1}. {q.question}
            </h2>

            {q.options.map((option, i) => {
              const correct = result?.correctAnswers.find(
                (c) => c.questionId === q._id
              )?.correctAnswer;

              const isSelected = answers[q._id] === i;

              return (
                <label
                  key={i}
                  className={`flex items-center gap-2 mb-2 p-3 rounded-lg border cursor-pointer transition
                  ${
                    !result && isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={q._id}
                    disabled={result !== null}
                    checked={isSelected}
                    onChange={() => handleOptionChange(q._id, i)}
                    className="mr-3"
                  />

                  <span className="flex items-center gap-2">
                    {option}

                    {result && i === correct && (
                      <FaCheckCircle className="text-green-500" />
                    )}

                    {result && isSelected && i !== correct && (
                      <FaTimesCircle className="text-red-500" />
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        ))}

        {/* BUTTONS */}
<div className="mt-6">

  {!result && (
    <>
      <button
        onClick={() => handleSubmit(false)}
        disabled={loading || answeredCount !== quiz.questions.length}
        className={`px-6 py-3 rounded-lg text-white transition
        ${
          answeredCount !== quiz.questions.length
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500"
        }`}
      >
        {loading ? "Submitting..." : "Submit Quiz"}
      </button>

      {answeredCount !== quiz.questions.length && (
        <p className="text-sm text-gray-500 mt-2">
          Please answer all questions before submitting.
        </p>
      )}
    </>
  )}

  {result && (
    <>
      <button
        onClick={handleRetake}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500"
      >
        Retake Quiz
      </button>

      <button
        onClick={() => navigate("/")}
        className="ml-4 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
      >
        Back to Topics
      </button>
    </>
  )}

</div>

      </div>
    </div>
  );
};

export default QuizPage;