
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [jobDesc, setJobDesc] = useState("");
  const [file, setFile] = useState(null);
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🚀 HANDLE GENERATE
  const handleGenerate = async () => {
    if (!jobDesc) {
      alert("Job description required");
      return;
    }

    if (!file && !about) {
      alert("Upload resume or add description");
      return;
    }

    try {
      setLoading(true);

      let resumeId = null;

      // 🔥 1. Upload Resume
      if (file) {
        const formData = new FormData();
        formData.append("resume", file);

        const uploadRes = await API.post("/user/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
   console.log("UPLOAD RESPONSE:", uploadRes.data);


        resumeId = uploadRes.data.data._id;
      }

      // 🔥 2. Job Analysis
      const analysisRes = await API.post("/interview/analyze", {
        resumeId,
        jobDescription: jobDesc || about,
      });
      console.log(analysisRes);
      
console.log("ANALYSIS RESPONSE:", analysisRes?.data);
      const jobAnalysisId = analysisRes.data._id;

      // 🔥 3. Navigate to dashboard
      navigate(`/dashboard/${jobAnalysisId}`);

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">
          Create Your Custom
          <span className="text-red-500"> Interview Plan</span>
        </h1>
        <p className="text-gray-400 mt-2 max-w-xl mx-auto">
          Let our AI analyze the job requirements and your profile
          to build a winning strategy
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-5xl mx-auto bg-[#0b1220]/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg p-6">

        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT → JOB DESCRIPTION */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Target Job Description</h2>
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                REQUIRED
              </span>
            </div>

            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Junior Backend Developer"
              className="w-full h-80 bg-[#020617] border border-gray-700 rounded-lg p-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <p className="text-right text-xs text-gray-500 mt-2">
              {jobDesc.length}/5000
            </p>
          </div>

          {/* RIGHT → PROFILE */}
          <div>
            <h2 className="font-semibold mb-3">Your Profile</h2>

            {/* Upload Resume */}
            <label className="flex flex-col items-center justify-center border border-green-500/30 bg-green-500/5 rounded-xl h-[130px] cursor-pointer hover:bg-green-500/10 transition">

              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />

              {file ? (
                <p className="text-green-400 text-sm">{file.name}</p>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                    📄
                  </div>
                  <p className="text-gray-400 text-sm">Upload Resume</p>
                  <p className="text-xs text-green-400 mt-1">BEST RESULTS</p>
                </>
              )}
            </label>

            {/* Divider */}
            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="mx-3 text-xs text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Self Description */}
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Briefly describe your experience, key skills..."
              className="w-full h-28 bg-[#020617] border border-gray-700 rounded-lg p-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-blue-400 mt-2">
              Either Resume or Self-Description is required
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-800">

          <p className="text-xs text-gray-500">
            ⚡ AI Powered • Approx 30s
          </p>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-lg font-semibold shadow-md"
          >
            {loading ? "Generating..." : "+ Generate My Interview Strategy"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Home;
