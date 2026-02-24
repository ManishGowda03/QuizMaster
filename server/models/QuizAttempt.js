import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [
      {
        questionId: String,
        selectedOption: Number,
      },
    ],
    score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("QuizAttempt", attemptSchema);