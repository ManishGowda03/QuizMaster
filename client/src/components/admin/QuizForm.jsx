import { useState, useEffect } from "react";

function QuizForm({ initialData, onSubmit, buttonText }) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setTopic(initialData.topic || "");
      setDescription(initialData.description || "");
      setDuration(initialData.duration || "");
      setQuestions(initialData.questions || []);
    }
  }, [initialData]);

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

  const submitForm = (e) => {
    e.preventDefault();

    onSubmit({
      title,
      topic,
      description,
      duration,
      questions,
    });
  };

  return (
    <form onSubmit={submitForm} className="space-y-6">

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
        placeholder="Topic"
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

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-gray-800 p-6 rounded-xl space-y-4">

          <h3 className="font-semibold">Question {qIndex + 1}</h3>

          <textarea
            rows="3"
            className="w-full p-3 bg-gray-700 rounded whitespace-pre-line"
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
        {buttonText}
      </button>

    </form>
  );
}

export default QuizForm;