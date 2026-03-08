import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import QuizForm from "../../components/admin/QuizForm";

function AddQuiz() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      await api.post("/quizzes", data);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-slate-100 to-emerald-100 py-10">

      <div className="max-w-4xl mx-auto px-6">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Add Quiz
        </h1>

        <div className="bg-white border border-gray-200 shadow rounded-xl p-6">

          <QuizForm
            initialData={{
              questions: [
                { question: "", options: ["", "", "", ""], correctAnswer: 0 },
              ],
            }}
            onSubmit={handleCreate}
            buttonText="Create Quiz"
          />

        </div>

      </div>

    </div>
  );
}

export default AddQuiz;