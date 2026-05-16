 import express from 'express'
import { analyzeJob, getHistory, getSingleAnalysis } from '../Controller/Resume.js';
import { startInterview, submitAnswer } from '../Controller/Interview.js';
import { auth } from '../Middleware/auth.js';

 const router=express.Router()

 router.post("/analyze", analyzeJob);
router.get("/history", getHistory);
router.get("/:id", getSingleAnalysis);
router.post("/start", startInterview);
router.post("/answer", submitAnswer);


export default router