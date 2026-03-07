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

  if (!quiz) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Update Quiz</h1>

      <QuizForm
        initialData={quiz}
        onSubmit={handleUpdate}
        buttonText="Update Quiz"
      />
    </div>
  );
}

export default UpdateQuiz;