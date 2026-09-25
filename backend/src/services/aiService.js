import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Supported Gemini Model Candidates in priority order
 */
const PRIMARY_MODELS = [
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

/**
 * Lazy initialization of Google Generative AI client
 */
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in backend/.env');
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Helper to run generateContent with automatic model fallback
 */
const generateWithFallback = async (options) => {
  const genAI = getAIClient();
  let lastError = null;

  for (const modelName of PRIMARY_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: options.systemInstruction,
        generationConfig: options.generationConfig,
      });

      const result = await model.generateContent(options.prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      console.warn(`[AI Fallback] Model ${modelName} encountered error: ${err.message?.slice(0, 120)}. Trying next model...`);
    }
  }

  throw lastError || new Error('All Gemini model candidates failed to respond.');
};

/**
 * 1. AI Rubric & Code Evaluation Engine
 */
export const evaluateSubmissionWithAI = async ({ taskPrompt, studentCode, rubric, language = 'javascript' }) => {
  const prompt = `
You are an expert senior computer science professor and tech lead evaluating a student's code submission.

Task Description:
${taskPrompt || 'General coding assignment'}

Programming Language:
${language}

Evaluation Rubric:
${rubric || 'Functional correctness (40%), Time/Space complexity (25%), Clean code & naming (20%), Edge cases & error handling (15%)'}

Student's Submission:
\`\`\`${language}
${studentCode}
\`\`\`

Return ONLY a valid JSON object matching this schema without surrounding markdown wrappers if possible:
{
  "score": 85,
  "letterGrade": "A",
  "summary": "Clear, concise 2-sentence feedback summary",
  "rubricBreakdown": [
    { "criterion": "Functional Correctness", "score": 38, "maxScore": 40, "comment": "Matches required output" },
    { "criterion": "Time Complexity", "score": 20, "maxScore": 25, "comment": "O(n) approach" },
    { "criterion": "Code Quality", "score": 17, "maxScore": 20, "comment": "Clean structure and naming" },
    { "criterion": "Edge Cases", "score": 10, "maxScore": 15, "comment": "Consider empty inputs" }
  ],
  "strengths": [
    "Modular function structure",
    "Proper variable naming conventions"
  ],
  "improvements": [
    "Add boundary check for null or empty values",
    "Include descriptive error messages"
  ],
  "suggestedRefactor": "Optional improved code snippet",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)"
}
`;

  const responseText = await generateWithFallback({
    prompt,
    generationConfig: { responseMimeType: 'application/json' },
  });

  const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};

/**
 * 2. 24/7 AI Tutor / Mentor Chatbot
 */
export const askAITutor = async ({ question, courseContext, chatHistory = [] }) => {
  const systemInstruction = `You are LearnSphere AI — a friendly, brilliant, and patient computer science tutor for full-stack developers and students.
Your goal is to guide students to understand concepts deeply, provide practical code examples, debug errors step-by-step, and encourage best practices.
Keep explanations clear, engaging, and well-formatted with markdown and code snippets where helpful.`;

  let conversationPrompt = '';
  if (courseContext) {
    conversationPrompt += `[Current Course Context: ${courseContext}]\n\n`;
  }

  if (chatHistory.length > 0) {
    conversationPrompt += 'Previous conversation:\n';
    chatHistory.slice(-6).forEach((msg) => {
      conversationPrompt += `${msg.role === 'user' ? 'Student' : 'LearnSphere AI'}: ${msg.content}\n`;
    });
    conversationPrompt += '\n';
  }

  conversationPrompt += `Student Question: ${question}\n\nLearnSphere AI Response:`;

  return await generateWithFallback({
    prompt: conversationPrompt,
    systemInstruction,
  });
};

/**
 * 3. AI Quiz & Checkpoint Generator
 */
export const generateQuizWithAI = async ({ topic, difficulty = 'intermediate', count = 4 }) => {
  const prompt = `
Generate a ${count}-question multiple choice quiz on the topic "${topic}" with difficulty level "${difficulty}".

Return ONLY a valid JSON object matching this schema:
{
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "codeSnippet": null,
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Why Option A is correct and others are incorrect."
    }
  ]
}
`;

  const responseText = await generateWithFallback({
    prompt,
    generationConfig: { responseMimeType: 'application/json' },
  });

  const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};

/**
 * 4. AI Resume & Career ATS Analyzer
 */
export const analyzeResumeWithAI = async ({ resumeText, targetRole = 'Full Stack Software Engineer' }) => {
  const prompt = `
Analyze the following student resume for the target role: "${targetRole}".

Resume Text:
${resumeText}

Return ONLY a valid JSON object matching this schema:
{
  "atsScore": 82,
  "matchLevel": "Strong Match",
  "summary": "2-sentence executive summary of the resume's alignment with ${targetRole}",
  "keyStrengths": ["Listed modern tech stack (React, Node, MongoDB)", "Highlighted quantifiable project metrics"],
  "missingKeywords": ["Docker", "CI/CD pipelines", "Unit testing / Jest", "TypeScript"],
  "actionableImprovements": [
    "Quantify achievements in project bullet points with metrics",
    "Add a dedicated System Design & Architecture section"
  ],
  "recommendedCourses": [
    "MERN & Next.js AI Architecture",
    "DSA & System Design Accelerator"
  ]
}
`;

  const responseText = await generateWithFallback({
    prompt,
    generationConfig: { responseMimeType: 'application/json' },
  });

  const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};
