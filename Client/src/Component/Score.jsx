
const ScoreCard = ({ score }) => {
  return (
    <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 text-center">

      <p className="text-gray-400 text-sm mb-2">
        MATCH SCORE
      </p>

      <div className="text-4xl font-bold text-green-400">
        {score}
      </div>

      <p className="text-green-400 mt-2 text-sm">
        Strong Match
      </p>
    </div>
  );
};

export default ScoreCard;

