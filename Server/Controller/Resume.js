import pdfParse from "pdf-parse-new";
import {  generateJobAnalysis, parseResume } from "../Service/ai.js";
import Resume from "../Model/Resume.js";
import JobAnalyze from "../Model/JobAnalyze.js";


// 1. User uploads resume
//    ↓
// 2. AI parses resume
//    ↓
// 3. User pastes job description
//    ↓
// 4. AI analyzes match
//    ↓
// 5. Report saved in DB
//    ↓
// 6. User can view history anytime


//--------------------------------Uploads PDF → extracts text → AI parses → saves structured resume---
export const extractText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1️⃣ Extract text
    const data = await pdfParse(req.file.buffer);
    const extractedText = data.text;

    // 2️⃣ Save initial resume (status: processing)
    const resume = await Resume.create({
      userId: req.userId,
      fileUrl: "temp",
      extractedText,
      status: "processing",
    });

    // 3️⃣ AI analysis
    const aiData = await parseResume(extractedText);

    // 4️⃣ Update resume with structured data
    resume.parsedData = {
       name: aiData.name,
       email: aiData.email,
      skills: aiData.skills,
      projects: aiData.projects,
      experience: aiData.experience,
      education: aiData.education,
    };

    // resume.atsScore = aiData.matchScore;

    // optional (if you want quick save)
    // resume.interviews = aiData.interviewQuestions;

    resume.status = "completed";

    await resume.save();

    res.json({
      message: "Resume analyzed successfully",
      data: resume,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Resume processing failed",
    });
  }
};

//Analyze job
//Takes:
//Resume (structured)
//Job Description (text)
//Runs AI → returns match score, gaps, etc.


export const analyzeJob = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ msg: "Resume not found" });
    }

    const result = await generateJobAnalysis(
      resume.parsedData,
      jobDescription
    );

    // 🔥 Save to DB
    const saved = await JobAnalyze.create({
      userId: req.user?.id,
      resumeId,
      jobDescription,
      ...result,
    });

    console.log("REQ BODY:", req.body);

    res.json(saved);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Job analysis failed" });
  }
};


//👉 Fetch all past reports for user -> User Dashboard → All past analyses

export const getHistory = async (req, res) => {
  try {
    const data = await JobAnalyze.find({ userId: req.user?.id })
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch history" });
  }
};


//Detailed Report Page

export const getSingleAnalysis = async (req, res) => {
  try {
    const analysis = await JobAnalyze.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching analysis" });
  }
};