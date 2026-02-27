import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const QuizPage = () => {
  const { topic } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await api.get(`/quizzes/${topic}`);
      setQuiz(res.data);
      setTimeLeft(res.data.duration * 60);
    };

    fetchQuiz();
  }, [topic]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    });
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.keys(answers).map(id => ({
      questionId: id,
      selectedOption: answers[id],
    }));

    const res = await api.post("/attempts", {
      quizId: quiz._id,
      answers: formattedAnswers,
    });

    alert(`Your Score: ${res.data.score}/${res.data.totalQuestions}`);
  };

  if (!quiz) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>

      <p className="mb-4 text-red-400">
        Time Left: {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </p>

      {quiz.questions.map((q, index) => (
        <div key={q._id} className="mb-6 bg-slate-800 p-4 rounded-xl">
          <h2 className="font-semibold mb-2">
            {index + 1}. {q.question}
          </h2>

          {q.options.map((option, i) => (
            <label key={i} className="block mb-2 cursor-pointer">
              <input
                type="radio"
                name={q._id}
                className="mr-2"
                onChange={() => handleOptionChange(q._id, i)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-green-600 px-6 py-2 rounded-xl hover:bg-green-500"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default QuizPage;