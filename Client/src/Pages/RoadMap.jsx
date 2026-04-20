import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const Roadmap = () => {
  const { jobAnalysisId } = useParams();
  const [roadmap, setRoadmap] = useState([]);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await API.get(`/job/${jobAnalysisId}`);
      setRoadmap(res.data.roadmap || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white p-8">

      <h1 className="text-3xl font-bold mb-10">
        📅 Preparation Roadmap
      </h1>

      <div className="space-y-6 max-w-3xl">

        {roadmap.map((day, index) => (
          <div
            key={index}
            className="bg-[#111827] p-6 rounded-xl border border-gray-800"
          >
            <h2 className="text-lg font-semibold mb-2">
              Day {index + 1}
            </h2>

            <ul className="text-gray-300 space-y-1">
              {day.tasks?.map((task, i) => (
                <li key={i}>• {task}</li>
              ))}
            </ul>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Roadmap;

