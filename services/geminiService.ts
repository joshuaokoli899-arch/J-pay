import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A bit of a hack for environments where process.env is not defined.
  // In a real build setup, this would be handled by the build tool.
  console.warn("API_KEY is not set. AI Assistant will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

export const getFinancialAdvice = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "I'm sorry, my connection to the AI service is not configured. Please check the API key.";
  }
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are J pay, a helpful and friendly AI financial assistant. Provide concise, easy-to-understand financial tips and advice for users in Nigeria. Do not give personalized investment advice that requires a license. Keep your tone encouraging and positive. Format your answers using markdown.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    return "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
};
