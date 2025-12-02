// server/src/models/QuizModel.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ["mcq", "true_false", "text"],
      required: true,
    },
    options: [String], // for MCQ
    // For simplicity:
    // mcq   -> correctAnswer = string option value
    // true_false -> correctAnswer = true/false
    // text  -> correctAnswer = string (exact match)
    correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    isPublic: { type: Boolean, default: true },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
