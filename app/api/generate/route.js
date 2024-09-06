import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
You are a flashcard creator. Generate concise and effective flashcards from the provided text. 12 flashcards are required.
Format output as JSON: [{ "question": "...", "answer": "..." }]
`;

export async function POST(req) {
  try {
    const { topic } = await req.json();
    const prompt = `${systemPrompt} Topic: ${topic}`;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    let flashcards = JSON.parse(text.trim());
    if (!Array.isArray(flashcards)) {
      throw new Error("Generated content is not in the expected array format");
    }

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}