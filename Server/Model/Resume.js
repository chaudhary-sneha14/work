//Upload Resume → Store File URL → Extract Text → Parse → Save in DB

import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileName: String,
    fileType: String,
    fileSize: Number,

    extractedText: String,

    parsedData: {
      name: String,
      email: String,
      summary: String,


      skills: {
  type: [String],
  default: [],
},

      projects: [
        {
         _id: false,
          name: String,
          description: String,
          techStack: [String],
          default:[],
        },
      ],

      experience: [
        {
              _id: false,
          company: String,
          role: String,
          duration: String,
          description: String,
          default:[],
        },
      ],

      education: [
        {
              _id: false,
          degree: String,
          institute: String,
          year: String,
          default:[],
        },
      ],
    },

    // atsScore: Number,

    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
    },

    jobAnalysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobAnalysis",
    },

    interviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
      },
    ],
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1 });
resumeSchema.index({ createdAt: -1 });

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume