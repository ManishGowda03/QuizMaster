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

      <div className="p-8">
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
              onClick={() => navigate(`/quiz/${quiz.topic}`)}
              className="cursor-pointer bg-gray-800 p-6 rounded-xl shadow hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold mb-2">
                {quiz.title}
              </h3>

              <p className="text-gray-400 mb-4">
                {quiz.description}
              </p>

              <p className="text-sm text-gray-500 mb-4">
                Duration: {quiz.duration} mins
              </p>

              {/* Admin Controls */}
              {isAdmin && (
                <div
                  className="flex gap-2 mt-2"
                  onClick={(e) => e.stopPropagation()} // prevent card click
                >
                  <button
                    onClick={(e) =>
                      handleDelete(quiz._id, e)
                    }
                    className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/admin/update/${quiz._id}`)
                    }
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