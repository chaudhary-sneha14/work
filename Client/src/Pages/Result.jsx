
import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <div className="text-white p-10">No data found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          🎯 Interview Result
        </h1>

        {/* SCORE */}
        <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 mb-6">
          <p className="text-gray-400 text-sm">OVERALL SCORE</p>
          <p className="text-4xl font-bold text-green-400">
            {state.overallScore}
          </p>
        </div>

        {/* SUMMARY */}
        <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 mb-6">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p className="text-gray-300">{state.summary}</p>
        </div>

        {/* STRENGTHS */}
        <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 mb-6">
          <h2 className="text-green-400 font-semibold mb-3">
            Strengths
          </h2>

          <ul className="space-y-2">
            {state.strengths?.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>

        {/* WEAKNESSES */}
        <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 mb-6">
          <h2 className="text-red-400 font-semibold mb-3">
            Weaknesses
          </h2>

          <ul className="space-y-2">
            {state.weaknesses?.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>

        {/* IMPROVEMENT */}
        <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 mb-6">
          <h2 className="text-yellow-400 font-semibold mb-3">
            Improvement Tips
          </h2>

          <ul className="space-y-2">
            {state.improvementTips?.map((tip, i) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">

          <button
            onClick={() => navigate("/")}
            className="bg-gray-700 px-6 py-3 rounded"
          >
            Back to Home
          </button>

          <button
            onClick={() =>
              navigate(`/roadmap/${state.jobAnalysisId}`)
            }
            className="bg-red-500 px-6 py-3 rounded font-semibold"
          >
            View Roadmap →
          </button>

        </div>

      </div>
    </div>
  );
};

export default Result;

