// import { useEffect, useState } from "react";
// import API from "../services/api";
// import { useNavigate, useParams } from "react-router-dom";

// const Interview = () => {
//   const { jobAnalysisId } = useParams();
//   const navigate = useNavigate();

//   const [interviewId, setInterviewId] = useState(null);
//   const [question, setQuestion] = useState(null);
//   const [nextQuestion, setNextQuestion] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [feedback, setFeedback] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // 🚀 START INTERVIEW
//   useEffect(() => {
//     if (jobAnalysisId) startInterview();
//   }, [jobAnalysisId]);

//   const startInterview = async () => {
//     try {
//       const res = await API.post("/interview/start", { jobAnalysisId });

//       setInterviewId(res.data.interviewId);
//       setQuestion(res.data.question);

//     } catch (err) {
//       console.error("START ERROR:", err);
//     }
//   };

//   // 🚀 SUBMIT ANSWER
//   const submit = async () => {
//     if (!answer || loading) return;

//     setLoading(true);

//     try {
//       const res = await API.post("/interview/answer", {
//         interviewId,
//         answer,
//       });

//       console.log("AI RESPONSE:", res.data);

//       // 🔥 TECH RESULT
//       if (res.data.phaseCompleted === "technical") {
//         navigate("/tech-result", {
//           state: res.data,
//         });
//         return;
//       }

//       // 🔥 FINAL HR RESULT (DYNAMIC)
//       if (res.data.message === "Interview completed") {
//         navigate("/hr-result", {
//           state: res.data, // ✅ REAL AI DATA
//         });
//         return;
//       }

//       // 👉 CONTINUE INTERVIEW
//       setFeedback(res.data.feedback);
//       setNextQuestion(res.data.nextQuestion);

//     } catch (err) {
//       console.error("SUBMIT ERROR:", err);
//     }

//     setLoading(false);
//   };

//   // 👉 NEXT QUESTION
//   const next = () => {
//     setQuestion(nextQuestion);
//     setNextQuestion(null);
//     setAnswer("");
//     setFeedback(null);
//   };

//   // ⛔ LOADING
//   if (!question) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#0b0f17] text-gray-400">
//         Preparing your interview...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0b0f17] via-[#0f172a] to-[#020617] text-white flex items-center justify-center px-4">

//       <div className="w-full max-w-3xl">

//         {/* HEADER */}
//         <div className="mb-6 text-center">
//           <h1 className="text-2xl font-bold">AI Interview</h1>
//           <p className="text-gray-400 text-sm">
//             {question.type === "technical"
//               ? "Technical Round"
//               : "HR Round"}
//           </p>
//         </div>

//         {/* QUESTION */}
//         <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 mb-4">
//           <p className={`text-sm mb-2 ${
//             question.type === "technical"
//               ? "text-red-400"
//               : "text-yellow-400"
//           }`}>
//             {question.type === "technical"
//               ? "Technical Question"
//               : "HR Question"}
//           </p>

//           <h2 className="text-lg font-medium">
//             {question.question}
//           </h2>
//         </div>

//         {/* ANSWER */}
//         <textarea
//           value={answer}
//           onChange={(e) => setAnswer(e.target.value)}
//           placeholder="Type your answer..."
//           className="w-full bg-[#020617] border border-gray-700 p-4 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
//           rows={5}
//         />

//         {/* SUBMIT */}
//         <button
//           onClick={submit}
//           disabled={loading}
//           className="w-full bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg"
//         >
//           {loading ? "Evaluating..." : "Submit Answer"}
//         </button>

//         {/* FEEDBACK */}
//         {feedback && (
//           <div className="mt-6 bg-[#111827] p-5 rounded-xl border border-gray-800">

//             <div className="flex justify-between mb-2">
//               <p className="text-gray-400 text-sm">AI Feedback</p>
//               <span className="text-green-400 font-bold">
//                 {feedback.score}/10
//               </span>
//             </div>

//             <p className="text-gray-300 mb-3">
//               {feedback.feedback}
//             </p>

//             <button
//               onClick={next}
//               className="w-full bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded"
//             >
//               Next Question →
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default Interview;