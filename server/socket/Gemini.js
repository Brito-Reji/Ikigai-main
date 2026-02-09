import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// get AI response with course context and chat history
export async function getAIResponse(question, courseContext, chatHistory = []) {

  // build chat history context
  const historyText =
    chatHistory.length > 0
      ? chatHistory.map(m => `${m.senderName}: ${m.content}`).join("\n")
      : "No previous messages";

  const prompt = `You are an AI assistant for an online learning platform. You are helping students in a course chat room.

COURSE INFORMATION:
- Title: ${courseContext.title}
- Description: ${courseContext.description}
- Overview: ${courseContext.overview}

RECENT CHAT MESSAGES (last 10):
${historyText}

STUDENT QUESTION: ${question}

Please provide a helpful, concise response. Be friendly and encouraging. If the question is about the course, use the course information above. If the question references recent chat, use the chat history for context. Keep response under 200 words.`;

  try {
 const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
 
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I couldn't process your request right now. Please try again.";
  }
}
