import ai from "../Config/ai.js";

// Upload → Extract Text → AI Parse → Save → Response


export const parseResume = async (resumeText) => {
  try {
 const prompt = `
You are an expert resume parser.

Extract structured data from the resume.

STRICT RULES:
- Return ONLY valid JSON
- Do NOT leave fields empty if data exists
- Extract ALL sections carefully
- Identify sections like Skills, Projects, Education, Experience

Return format:
{
  "name": "",
  "email": "",
  "skills": [string],
  "projects": [
    {
      "name": "",
      "description": "",
      "techStack": [string]
    }
  ],
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "description": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "institute": "",
      "year": ""
    }
  ]
}

IMPORTANT:
- Skills section exists → MUST extract all skills
- Projects section exists → MUST extract all projects
- Education section exists → MUST extract all entries
- Do NOT return empty arrays if data exists
- Infer structure even if formatting is messy

Resume:
${resumeText}
`;
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    let result = response.choices[0].message.content;

    result = result.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(result);

    return {
      name: parsed.name || "",
      email: parsed.email || "",
      skills: [...new Set(parsed.skills || [])],
      projects: parsed.projects || [],
      experience: parsed.experience || [],
      education: parsed.education || [],
    };

  } catch (error) {
    console.error(error);
    throw new Error("Resume parsing failed");
  }
};

// Job Analysis

export const generateJobAnalysis = async (resumeData, jobDescription) => {
  try {
    const prompt = `
You are an expert interviewer.

Candidate Resume:
${JSON.stringify(resumeData)}

Job Description:
${jobDescription}

Return ONLY JSON:

{
  "matchScore": number,

  "skillGaps": [
    { "skill": "", "severity": "high | medium | low" }
  ],

  "technicalQuestions": [
    {
      "question": "",
      "intent": "",
      "idealAnswer": ""
    }
  ],

  "behavioralQuestions": [
    {
      "question": "",
      "intent": "",
      "idealAnswer": ""
    }
  ],

  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": ["", ""]
    }
  ]
}
`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    let result = response.choices[0].message.content;

    result = result.replace(/```json|```/g, "").trim();

    return JSON.parse(result);

  } catch (error) {
    console.error(error);
    throw new Error("Job analysis failed");
  }
};

//-----------Evaluate answer-----------------

export const evaluateAnswer = async (question, idealAnswer, userAnswer) => {
  try {
    const prompt = `
You are an experienced technical interviewer.

Question:
${question}

Ideal Answer:
${idealAnswer}

Candidate Answer:
${userAnswer}

Evaluate the candidate answer strictly.

Return ONLY JSON:

{
  "score": number (0-10),
  "feedback": "clear, short, constructive feedback"
}

Rules:
- Score based on correctness, depth, clarity
- Be strict but fair
- Do not return explanation outside JSON
`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    let result = response.choices[0].message.content;

    if (!result) {
      throw new Error("Empty AI response");
    }

    // clean JSON
    result = result.replace(/```json|```/g, "").trim();

    return JSON.parse(result);

  } catch (error) {
    console.error("Evaluation Error:", error.message);
    throw new Error("Answer evaluation failed");
  }
};

//-----genrate interview summary-------------
export const generateInterviewSummary = async (answers) => {
  const prompt = `
You are an interview coach.

Candidate answers:
${JSON.stringify(answers)}

Analyze performance.

Return ONLY JSON:

{
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "improvementTips": []
}
`;

  const response = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages: [{ role: "user", content: prompt }],
  });

  let result = response.choices[0].message.content;
  result = result.replace(/```json|```/g, "").trim();

  return JSON.parse(result);
};