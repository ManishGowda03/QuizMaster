import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

function AddQuiz() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = Number(value);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/quizzes", {
        title,
        description,
        topic,
        duration,
        questions,
      });

      navigate("/");
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Quiz</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          placeholder="Title"
          className="w-full p-3 bg-gray-800 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Topic (URL name)"
          className="w-full p-3 bg-gray-800 rounded"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Duration (minutes)"
          className="w-full p-3 bg-gray-800 rounded"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full p-3 bg-gray-800 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* QUESTIONS */}
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-gray-800 p-6 rounded-xl space-y-4">
            <h2 className="font-semibold">Question {qIndex + 1}</h2>

            <input
              type="text"
              placeholder="Question text"
              className="w-full p-2 bg-gray-700 rounded"
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(qIndex, e.target.value)
              }
              required
            />

            {q.options.map((option, oIndex) => (
              <input
                key={oIndex}
                type="text"
                placeholder={`Option ${oIndex + 1}`}
                className="w-full p-2 bg-gray-700 rounded"
                value={option}
                onChange={(e) =>
                  handleOptionChange(qIndex, oIndex, e.target.value)
                }
                required
              />
            ))}

            <select
              className="w-full p-2 bg-gray-700 rounded"
              value={q.correctAnswer}
              onChange={(e) =>
                handleCorrectAnswerChange(qIndex, e.target.value)
              }
            >
              <option value={0}>Correct: Option 1</option>
              <option value={1}>Correct: Option 2</option>
              <option value={2}>Correct: Option 3</option>
              <option value={3}>Correct: Option 4</option>
            </select>

            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Delete Question
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="bg-blue-600 px-6 py-2 rounded"
        >
          + Add Question
        </button>

        <button
          type="submit"
          className="bg-green-600 px-6 py-3 rounded"
        >
          Create Quiz
        </button>

      </form>
    </div>
  );
}

export default AddQuiz;