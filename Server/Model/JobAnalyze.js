import mongoose from "mongoose";

const jobAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },

    jobDescription: String,

    matchScore: Number,

    skillGaps: [
      {
        skill: String,
        severity: {
          type: String,
          enum: ["high", "medium", "low"],
           _id: false,
        },
      },
    ],

    technicalQuestions: [
      {
        _id: false,
        question: String,
        intent: String,
        idealAnswer: String,
      },
    ],

    behavioralQuestions: [
      {
        _id: false,
        question: String,
        intent: String,
        idealAnswer: String,
      },
    ],

    preparationPlan: [
      {
        _id: false,
        day: Number,
        focus: String,
        tasks: [String],
      },
    ],
  },
  { timestamps: true }
);

const JobAnalyze = mongoose.model("JobAnalysis", jobAnalysisSchema);
export default JobAnalyze