import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: Number,
    required: true,
  },
});

const quizSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      unique: true, // one quiz per topic
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    duration: {
      type: Number, // in minutes
      required: true,
    },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);