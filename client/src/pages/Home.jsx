import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FaClock, FaBookOpen } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = storedUser?.user?.role === "admin";

  useEffect(() => {
  const wakeServer = async () => {
    try {
      await fetch("https://quizmaster-s2c3.onrender.com/api/health");
      console.log("Backend awakened");
    } catch (error) {
      console.log("Backend wake attempt failed");
    }
  };

  wakeServer();
}, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/quizzes");
        setQuizzes(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch quizzes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = (quiz) => {
    const confirmStart = window.confirm(
      `Start "${quiz.title}" quiz?\n\nDuration: ${quiz.duration} minutes.`
    );

    if (!confirmStart) return;

    navigate(`/quiz/${quiz.topic}`);
  };

  const handleDelete = async (quizId, e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/quizzes/${quizId}`);

      setQuizzes((prev) =>
        prev.filter((quiz) => quiz._id !== quizId)
      );
      toast.success("Quiz deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleCardClick = (quiz) => {
    if (isAdmin) {
      navigate(`/admin/update/${quiz._id}`);
    } else {
      handleStartQuiz(quiz);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-slate-100 to-emerald-100 page-transition">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">

  {/* HERO SECTION */}
  <div className="text-center mb-16">

    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
      Master Your Knowledge with QuizMaster
    </h1>

    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
      Challenge yourself with quizzes across multiple topics,
      track your attempts, and improve your skills.
    </p>

    {!isAdmin && (
      <button
  onClick={() => {
    const firstQuiz = quizzes[0];
    if (firstQuiz) handleStartQuiz(firstQuiz);
  }}
  className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-500 transition text-lg"
>
  Start Learning
</button>
    )}

  </div>

  <hr className="border-gray-300 mb-10"/>

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Available Topics
          </h2>

          {isAdmin && (
            <button
              onClick={() => navigate("/admin/add")}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-500 transition"
            >
              + Add Quiz
            </button>
          )}
        </div>

        {error && (
          <p className="text-red-500 mb-6">{error}</p>
        )}

        {/* Quiz Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">

          {loading ? (

            [...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white p-6 rounded-xl shadow border border-gray-200"
              >
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))

          ) : (

            quizzes.map((quiz) => (
              <div
                key={quiz._id}
                onClick={() => handleCardClick(quiz)}
                className="group cursor-pointer bg-white p-6 rounded-xl shadow-md border border-gray-200
                hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-3 hover:border-blue-300
                transition-all duration-300 relative flex flex-col justify-between"
              >

                {/* Delete icon for admin */}
                {isAdmin && (
                  <button
                    onClick={(e) => handleDelete(quiz._id, e)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                  >
                    <FiTrash2 size={20} />
                  </button>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
                    <FaBookOpen className="text-blue-600" />
                    {quiz.title}
                  </h3>

                  <p className="text-gray-600 mb-5 text-sm">
                    {quiz.description}
                  </p>

                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FaClock />
                    {quiz.duration} minutes
                  </p>
                </div>

                {/* Start button for users */}
                {!isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartQuiz(quiz);
                    }}
                    className="mt-6 w-full text-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                    bg-blue-100 hover:bg-blue-200 text-blue-700
                    py-2 rounded-lg transition-all duration-300 font-medium"
                  >
                    Start Quiz
                  </button>
                )}

              </div>
            ))

          )}

        </div>

      </div>
    </div>
  );
}

export default Home;