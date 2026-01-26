import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";
import { ANALYST_PROMPT_SYSTEM, WRITER_PROMPT_SYSTEM } from "../constants";

const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      enum: ["READY", "NEEDS_INFO"],
      description: "Status of the analysis. READY if no extra info needed, NEEDS_INFO otherwise.",
    },
    questions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 1-3 clarifying questions for the salesperson if NEEDS_INFO.",
    },
  },
  required: ["status", "questions"],
};

// Helper to get client instance
const getClient = (customApiKey?: string) => {
  const key = customApiKey || process.env.API_KEY;
  if (!key) {
    throw new Error("API Key is missing. Please check settings.");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const analyzeEmail = async (customerEmail: string, apiKey: string, modelName: string): Promise<AnalysisResult> => {
  try {
    const ai = getClient(apiKey);
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Customer Email Content:\n${customerEmail}`,
      config: {
        systemInstruction: ANALYST_PROMPT_SYSTEM,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    // Fallback in case of error
    return { status: "READY", questions: [] };
  }
};

export const generateReply = async (
  customerEmail: string, 
  userNotes: string, 
  signature: string,
  apiKey: string,
  modelName: string
): Promise<string> => {
  try {
    const ai = getClient(apiKey);
    const prompt = `
    # Input Data
    - Customer Original Email: ${customerEmail}
    - My Notes/Answers: ${userNotes}
    - My Signature: ${signature}
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: WRITER_PROMPT_SYSTEM,
      },
    });

    return response.text || "Failed to generate email.";
  } catch (error) {
    console.error("Generation Error:", error);
    return "Sorry, an error occurred while generating the email. Please check your API Key and Network.";
  }
};