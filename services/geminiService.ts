import { GoogleGenAI } from "@google/genai";
import { ScriptParams, ScriptType } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export const generateScript = async (params: ScriptParams): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let userPrompt = "";

  if (params.type === ScriptType.RESEARCH_GUIDE) {
    userPrompt = `
    GENERATE RESEARCH GUIDE

    Topic Details:
    TITLE: ${params.title}
    CORE THEME: ${params.title} 
    HOOK: ${params.hook}
    ANGLE: ${params.angle}
    KEYWORDS: ${params.keywords}
    `;
  } else {
    // For Scripts (Full or Short)
    const scriptTypeHeader = params.type === ScriptType.SHORT
      ? "GENERATE SHORT SCRIPT (60 Seconds Strict)"
      : "GENERATE SCRIPT";

    // When generating scripts, we prioritize the research material.
    // If metadata fields are present (e.g. from previous state), we include them as extra context,
    // but the system is designed to work with just the research notes.
    const hasMetadata = params.title;

    let contextBlock = "";
    if (hasMetadata) {
      contextBlock = `
    [CONTEXT & METADATA (Optional Override)]
    Title: ${params.title}
    Core Theme: ${params.title}
    Hook: ${params.hook}
    Angle: ${params.angle}
    Keywords: ${params.keywords}
      `;
    }

    userPrompt = `
    ${scriptTypeHeader}

    [RESEARCH MATERIAL / FILTERED NOTES]
    ${params.researchMaterial}

    ${contextBlock}
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest', // Automatically uses the most stable Flash model
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }], // Robust payload format
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });

    if (!response.text && !response.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Empty Gemini Response:", response);
      throw new Error("Gemini returned an empty response. This might be due to safety filters.");
    }

    return response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated.";
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);

    // Extract more specific error message if available
    let errorMsg = error.message || "Unknown API error";

    // Detect Quota Exhaustion and provide user-friendly advice
    if (errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("429")) {
      errorMsg = "QUOTA EXHAUSTED: Google's free tier limit reached. Please wait 60 seconds and try again, or check your Gemini API dashboard for limits.";
    }

    throw new Error(`Generation Failed: ${errorMsg}`);
  }
};