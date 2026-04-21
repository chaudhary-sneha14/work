import { useLocation, useNavigate } from "react-router-dom";

const HrResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f17] text-white">
        No data found
      </div>
    );
  }

  const {
    overallScore = 0,
    summary = "No summary available",
    strengths = [],
    weaknesses = [],
    improvementTips = [],
    jobAnalysisId,
  } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f17] to-[#020617] text-white flex items-center justify-center px-4">

      <div className="w-full max-w-4xl">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">HR Round Completed</h1>
          <p className="text-gray-400 text-sm">
            Here's your performance breakdown
          </p>
        </div>

        {/* SCORE CARD */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 text-center mb-6 shadow-lg">
          <p className="text-gray-400 text-sm mb-2">OVERALL SCORE</p>
          <h1 className="text-5xl font-bold text-green-400">
            {overallScore}%
          </h1>
        </div>

        {/* SUMMARY */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 mb-6">
          <h3 className="text-gray-300 font-semibold mb-2">Summary</h3>
          <p className="text-gray-400 leading-relaxed">{summary}</p>
        </div>

        {/* GRID SECTIONS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">

          {/* STRENGTHS */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4">
            <h3 className="text-green-400 font-semibold mb-3">Strengths</h3>
            {strengths.length > 0 ? (
              strengths.map((s, i) => (
                <p key={i} className="text-gray-300 text-sm mb-1">• {s}</p>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No data</p>
            )}
          </div>

          {/* WEAKNESSES */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4">
            <h3 className="text-red-400 font-semibold mb-3">Weaknesses</h3>
            {weaknesses.length > 0 ? (
              weaknesses.map((w, i) => (
                <p key={i} className="text-gray-300 text-sm mb-1">• {w}</p>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No data</p>
            )}
          </div>

          {/* TIPS */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4">
            <h3 className="text-yellow-400 font-semibold mb-3">Tips</h3>
            {improvementTips.length > 0 ? (
              improvementTips.map((t, i) => (
                <p key={i} className="text-gray-300 text-sm mb-1">• {t}</p>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No data</p>
            )}
          </div>

        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={() => navigate(`/roadmap/${jobAnalysisId}`)}
          className="w-full bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-xl font-medium"
        >
          View Preparation Roadmap →
        </button>

      </div>
    </div>
  );
};

export default HrResult;