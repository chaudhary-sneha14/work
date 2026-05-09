import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    jobAnalysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobAnalysis",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔹 Static questions
    questions: [
      {
        _id: false,
        question: String,
        intent: String,
        idealAnswer: String,
      },
    ],

    // 🔹 Dynamic answers
    answers: [
      {
        _id: false,
        question: String,
        userAnswer: String,
        score: Number,
        feedback: String,
      },
    ],

    currentQuestionIndex: {
      type: Number,
      default: 0,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },

    attemptNumber: {
      type: Number,
      default: 1,
    },
    phase: {
  type: String,
  enum: ["technical", "behavioral"],
  default: "technical",
},
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;