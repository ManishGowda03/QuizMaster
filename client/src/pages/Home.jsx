import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = storedUser?.user?.role === "admin";

  // ---------------- FETCH QUIZZES ----------------
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
  
  const handleStartQuiz = (quiz) => {
  const confirmStart = window.confirm(
    `Start "${quiz.title}" quiz?\n\nDuration: ${quiz.duration} minutes.\nThe timer will begin immediately.`
  );

  if (!confirmStart) return;

  navigate(`/quiz/${quiz.topic}`);
};

  // ---------------- DELETE QUIZ (ADMIN) ----------------
  const handleDelete = async (quizId, e) => {
    e.stopPropagation(); // prevent card click

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/quizzes/${quizId}`);
      setQuizzes((prev) =>
        prev.filter((quiz) => quiz._id !== quizId)
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            Available Topics 📚
          </h2>

          {/* Admin Add Quiz Button */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/add")}
              className="bg-green-600 px-6 py-3 rounded-xl hover:bg-green-500"
            >
              + Add Quiz
            </button>
          )}
        </div>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              onClick={() => handleStartQuiz(quiz)}
              className="cursor-pointer bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 
  hover:shadow-2xl hover:scale-[1.03] hover:border-blue-500 
  transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  📘 {quiz.title}
                </h3>

                <p className="text-gray-400 mb-4">
                  {quiz.description}
                </p>

                <p className="text-sm text-gray-500 flex items-center gap-2">
                  ⏱ Duration: {quiz.duration} mins
                </p>
              </div>

              {/* User Button */}
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition"
              >
                Start Quiz
              </button>

              {/* Admin Controls */}
              {isAdmin && (
                <div
                  className="mt-4 flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleDelete(quiz._id, e)}
                    className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => navigate(`/admin/update/${quiz._id}`)}
                    className="bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-500"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;