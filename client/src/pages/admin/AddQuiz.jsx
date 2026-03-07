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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Add Quiz</h1>

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
  );
}

export default AddQuiz;