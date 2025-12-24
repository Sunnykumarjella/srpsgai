
import { GoogleGenAI, Type } from "@google/genai";
import { TravelPassRequest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeRequests = async (requests: TravelPassRequest[]) => {
  if (!process.env.API_KEY) return "AI Insights unavailable (API Key not provided).";

  const prompt = `
    Analyze these travel pass requests and provide a short executive summary (max 3 sentences):
    ${JSON.stringify(requests.map(r => ({ type: r.passType, route: `${r.source}-${r.destination}`, status: r.status })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Unable to generate insights.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI verification engine.";
  }
};

export const verifyRoute = async (source: string, destination: string) => {
  if (!process.env.API_KEY) return { valid: true, note: "Manual verification required." };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Is the travel route from ${source} to ${destination} a standard student commuting distance? Provide answer in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCommutable: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ["isCommutable", "reason"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { valid: true, note: "AI validation skipped." };
  }
};
