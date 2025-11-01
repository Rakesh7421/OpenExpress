
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  // The environment is expected to have this key.
  console.warn("API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function getDesignSuggestions(prompt: string): Promise<string> {
  if (!API_KEY) {
    return Promise.resolve("API Key not configured. Please set up your API_KEY environment variable to use AI features.");
  }
  
  try {
    const fullPrompt = `
      You are an expert UI/UX and graphic designer.
      A user is asking for design suggestions for the following concept: "${prompt}".

      Please provide 3 distinct and creative design ideas. For each idea, suggest:
      1.  A concept or theme.
      2.  A color palette (with hex codes).
      3.  Font pairings (one for headings, one for body).
      4.  A brief layout description.

      Format your response clearly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch design suggestions from the AI model.");
  }
}
