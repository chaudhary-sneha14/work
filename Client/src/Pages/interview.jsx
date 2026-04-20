
import { useState, useEffect } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const Interview = () => {
  const { jobAnalysisId } = useParams();
  const navigate = useNavigate();

  const [interviewId, setInterviewId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const [phase, setPhase] = useState("technical"); // technical | behavioral
  const [showNextRound, setShowNextRound] = useState(false);
  const [showAnalyze, setShowAnalyze] = useState(false);

  const [progress, setProgress] = useState(0);
  const [finalResult, setFinalResult] = useState(null);

  // 🚀 START INTERVIEW
  useEffect(() => {
    startInterview();
  }, []);

  const startInterview = async () => {
    try {
      const res = await API.post("/interview/start", {
        jobAnalysisId,
      });

      setInterviewId(res.data.interviewId);
      setQuestion(res.data.question);
      setPhase(res.data.question.type);
      setProgress(0);
    } catch (err) {
      console.error(err);
    }
  };

  // 🚀 SUBMIT ANSWER
  const submitAnswer = async () => {
    if (!answer) return;

    setLoading(true);

    try {
      const res = await API.post("/interview/answer", {
        interviewId,
        answer,
      });

      setFeedback(res.data.feedback);
      setProgress(res.data.progress);

      // 🔥 FINAL STEP (after behavioral)
      if (res.data.message === "Interview completed") {
        setFinalResult(res.data);
        setShowAnalyze(true);
        setLoading(false);
        return;
      }

      // 🔥 DETECT TECH → HR SWITCH
      if (
        question.type === "technical" &&
        res.data.nextQuestion?.type === "behavioral"
      ) {
        setShowNextRound(true);
        setQuestion(res.data.nextQuestion);
        setAnswer("");
        setLoading(false);
        return;
      }

      // NORMAL FLOW
      setQuestion(res.data.nextQuestion);
      setPhase(res.data.nextQuestion.type);
      setAnswer("");

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // 🚀 HANDLE NEXT ROUND
  const handleNextRound = () => {
    setPhase("behavioral");
    setShowNextRound(false);
  };

  // 🚀 HANDLE RESULT
  const handleAnalyze = () => {
    navigate("/result", {
      state: {
        ...finalResult,
        jobAnalysisId,
      },
    });
  };

  // ⛔ LOADING
  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Starting Interview...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#0f1623] p-6 border-r border-gray-800">
        <h1 className="text-xl font-bold mb-6">IntervAI</h1>

        <button
          onClick={() => navigate("/")}
          className="text-gray-400 mb-6 hover:text-white"
        >
          ← Exit Interview
        </button>

        <p className="text-gray-500 text-sm mb-3">ROUNDS</p>

        <div className="space-y-3">
          <div className={`px-3 py-2 rounded ${
            phase === "technical"
              ? "bg-red-500/20 text-red-400"
              : "text-gray-400"
          }`}>
            Technical
          </div>

          <div className={`px-3 py-2 rounded ${
            phase === "behavioral"
              ? "bg-red-500/20 text-red-400"
              : "text-gray-400"
          }`}>
            Behavioral
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* ROUND LABEL */}
        <p className="text-sm text-gray-400 mb-2">
          {phase === "technical"
            ? "Technical Interview Round"
            : "HR / Behavioral Round"}
        </p>

        <h2 className="text-2xl font-bold mb-6">Live Interview</h2>

        {/* Question */}
        <div className="bg-[#111827] p-6 rounded-xl mb-6 border border-gray-800">
          {question.question}
        </div>

        {/* Answer */}
        {!showNextRound && !showAnalyze && (
          <>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full bg-[#0f172a] border border-gray-700 p-4 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={5}
            />

            <button
              onClick={submitAnswer}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded font-medium"
            >
              {loading ? "Evaluating..." : "Submit Answer"}
            </button>
          </>
        )}

        {/* FEEDBACK */}
        {feedback && (
          <div className="mt-6 bg-[#111827] p-4 rounded border border-gray-800">
            <p className="text-green-400 font-semibold">
              Score: {feedback.score}/10
            </p>
            <p className="text-gray-300 mt-2">
              {feedback.feedback}
            </p>
          </div>
        )}

        {/* 🔥 NEXT ROUND BUTTON */}
        {showNextRound && (
          <button
            onClick={handleNextRound}
            className="mt-6 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded font-semibold"
          >
            Start HR Round →
          </button>
        )}

        {/* 🔥 ANALYZE RESULT BUTTON */}
        {showAnalyze && (
          <button
            onClick={handleAnalyze}
            className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded font-semibold"
          >
            Analyze Result →
          </button>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-80 p-6 border-l border-gray-800">

        {/* PROGRESS */}
        <div className="bg-[#111827] p-4 rounded">
          <p className="text-gray-400 text-sm mb-2">PROGRESS</p>

          <div className="w-full bg-gray-700 h-2 rounded">
            <div
              className="bg-green-500 h-2 rounded transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-400 mt-2">
            {progress}%
          </p>
        </div>

      </div>
    </div>
  );
};

export default Interview