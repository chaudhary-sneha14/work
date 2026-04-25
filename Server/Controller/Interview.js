import mongoose from "mongoose";
import Interview from "../Model/Interview.js";
import JobAnalyze from "../Model/JobAnalyze.js";
import { evaluateAnswer, generateInterviewSummary } from "../Service/ai.js";

// 🚀 START INTERVIEW
export const startInterview = async (req, res) => {
  try {
    const { jobAnalysisId } = req.body;

    if (!jobAnalysisId) {
      return res.status(400).json({ msg: "jobAnalysisId required" });
    }

    const analysis = await JobAnalyze.findById(jobAnalysisId);

    if (!analysis) {
      return res.status(404).json({ msg: "Analysis not found" });
    }

    const technical = (analysis.technicalQuestions || []).map((q) => ({
      question: q.question || "",
      intent: q.intent || "",
      idealAnswer: q.idealAnswer || "",
      type: "technical",
    }));

    if (technical.length === 0) {
      return res.status(400).json({ msg: "No technical questions" });
    }

    const interview = await Interview.create({
      userId: new mongoose.Types.ObjectId(),
      resumeId: analysis.resumeId, // ✅ FIXED
      jobAnalysisId,
      questions: technical,
      phase: "technical",
      currentQuestionIndex: 0,
      answers: [],
      status: "in_progress",
    });

    return res.json({
      interviewId: interview._id,
      question: technical[0],
    });

  } catch (err) {
    console.error("START ERROR:", err);
    return res.status(500).json({ msg: "Start failed" });
  }
};

// 🚀 SUBMIT ANSWER
export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, answer } = req.body;

    if (!interviewId || !answer) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ msg: "Interview not found" });
    }

    const index = interview.currentQuestionIndex;
    const currentQ = interview.questions[index];

    if (!currentQ) {
      return res.status(400).json({ msg: "No question found" });
    }

    // 🧠 AI evaluation
    let feedback;
    try {
      feedback = await evaluateAnswer(
        currentQ.question,
        currentQ.idealAnswer,
        answer
      );
    } catch {
      feedback = { score: 5, feedback: "AI busy, try again" };
    }

    interview.answers.push({
      question: currentQ.question,
      userAnswer: answer,
      score: feedback.score,
      feedback: feedback.feedback,
    });

    interview.currentQuestionIndex++;

    const nextQ = interview.questions[interview.currentQuestionIndex];

    // 🔥 PHASE SWITCH OR END
    if (!nextQ) {

      // ======================
      // 🔹 TECH → HR SWITCH
      // ======================
      if (interview.phase === "technical") {

        const total = interview.answers.reduce((s, a) => s + a.score, 0);
        const techScore = Math.round(total / interview.answers.length);

        const techAnswers = [...interview.answers]; // ✅ FIX (save before reset)

        const analysis = await JobAnalyze.findById(interview.jobAnalysisId);

        const behavioral = (analysis.behavioralQuestions || []).map((q) => ({
          question: q.question || "",
          intent: q.intent || "",
          idealAnswer: q.idealAnswer || "",
          type: "behavioral",
        }));

        // switch phase
        interview.phase = "behavioral";
        interview.questions = behavioral;
        interview.currentQuestionIndex = 0;
        interview.answers = [];

        await interview.save();

        // 🧠 Generate summary of technical round
        let summaryData = {};
        try {
          summaryData = await generateInterviewSummary(techAnswers);
        } catch {
          summaryData = {
            summary: "Summary unavailable",
            strengths: [],
            weaknesses: [],
            improvementTips: [],
          };
        }

        return res.json({
          phaseCompleted: "technical",
          score: techScore,
          summary: summaryData.summary,
          strengths: summaryData.strengths,
          weaknesses: summaryData.weaknesses,
          improvementTips: summaryData.improvementTips,
          jobAnalysisId: interview.jobAnalysisId,
        });
      }

      // ======================
      // 🔹 FINAL RESULT (HR DONE)
      // ======================
      if (interview.phase === "behavioral") {

        const total = interview.answers.reduce((s, a) => s + a.score, 0);
        const finalScore = Math.round(total / interview.answers.length);

        const finalAnswers = [...interview.answers];

        await interview.save();

        let summaryData = {};
        try {
          summaryData = await generateInterviewSummary(finalAnswers);
        } catch {
          summaryData = {
            summary: "Summary unavailable",
            strengths: [],
            weaknesses: [],
            improvementTips: [],
          };
        }

        return res.json({
          message: "Interview completed",
          overallScore: finalScore,
          summary: summaryData.summary,
          strengths: summaryData.strengths,
          weaknesses: summaryData.weaknesses,
          improvementTips: summaryData.improvementTips,
          jobAnalysisId: interview.jobAnalysisId,
        });
      }
    }

    // 🔁 NORMAL FLOW
    await interview.save();

    return res.json({
      feedback,
      nextQuestion: nextQ,
    });

  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    return res.status(500).json({ msg: "Answer processing failed" });
  }
};