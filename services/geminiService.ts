import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// We will use a functional approach to interacting with Gemini
// The API key is now obtained exclusively from process.env.API_KEY

export const getGeminiRecommendations = async (
  query: string,
  products: Product[]
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    return "I'm having trouble connecting to the brain. API Key is missing.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Create a concise context string of available products
    const productContext = products
      .map(p => `- ${p.name} (${p.category || 'Item'}): ₹${p.price}`)
      .join('\n');

    const prompt = `
      You are Pulse AI, a helpful campus assistant for PU Pulse delivery app.
      
      User Query: "${query}"
      
      Available Items on Campus:
      ${productContext}
      
      Instructions:
      1. Recommend items from the list based on the user's query (e.g., cheap food, exam supplies).
      2. Be brief, friendly, and helpful. 
      3. If they ask for something not listed, suggest the closest alternative.
      4. Do not make up items.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Sorry, I couldn't think of a recommendation right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the brain. Please try again later.";
  }
};