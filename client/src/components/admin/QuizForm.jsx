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

      {/* TITLE */}
      <input
        type="text"
        placeholder="Quiz Title"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* TOPIC */}
      <input
        type="text"
        placeholder="Topic (URL friendly)"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        required
      />

      {/* DURATION */}
      <input
        type="number"
        placeholder="Duration (minutes)"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        required
      />

      {/* DESCRIPTION */}
      <textarea
        placeholder="Quiz Description"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      {/* QUESTIONS */}
      {questions.map((q, qIndex) => (
        <div
          key={qIndex}
          className="bg-gray-50 border border-gray-200 p-6 rounded-xl space-y-4"
        >

          <h3 className="font-semibold text-gray-700">
            Question {qIndex + 1}
          </h3>

          <textarea
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg"
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
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={option}
              onChange={(e) =>
                handleOptionChange(qIndex, oIndex, e.target.value)
              }
              required
            />
          ))}

          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
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
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete Question
            </button>
          )}

        </div>
      ))}

      <div className="flex gap-6 mt-6">

        <button
          type="button"
          onClick={addQuestion}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition shadow"
        >
          + Add Question
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 w-fit"
        >
          {buttonText}
        </button>

      </div>

    </form>
  );
}

export default QuizForm;