import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import QuizForm from "../../components/admin/QuizForm";

function UpdateQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await api.get(`/quizzes/id/${id}`);
      setQuiz(res.data);
    };

    fetchQuiz();
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      await api.put(`/quizzes/${id}`, data);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (!quiz)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-slate-100 to-emerald-100 py-10">

      <div className="max-w-4xl mx-auto px-6">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Update Quiz
        </h1>

        <div className="bg-white border border-gray-200 shadow rounded-xl p-6">

          <QuizForm
            initialData={quiz}
            onSubmit={handleUpdate}
            buttonText="Update Quiz"
          />

        </div>

      </div>

    </div>
  );
}

export default UpdateQuiz;