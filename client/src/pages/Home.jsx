import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/quizzes");
        setQuizzes(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch quizzes"
        );
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">
          Available Topics 📚
        </h2>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              onClick={() => navigate(`/quiz/${quiz.topic}`)}
              className="cursor-pointer bg-gray-800 p-6 rounded-xl shadow hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold mb-2">
                {quiz.title}
              </h3>

              <p className="text-gray-400 mb-4">
                {quiz.description}
              </p>

              <p className="text-sm text-gray-500">
                Duration: {quiz.duration} mins
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;