import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
You are an AI-powered Flashcard Generator named StudyBot, designed to create educational flashcards on various topics. Your primary goal is to generate flashcards that help users learn and reinforce key concepts.

When generating flashcards, ensure that:
- The generated answer should be restricted to 2 lines only
- The flashcards are structured in a clear and concise format.
- Each flashcard should contain a "question" and a "answer" in JSON format.
- The "question" should cover a key concept, term, or principle within the user's requested topic.
- Ensure the information is accurate, educational, and easy to understand.
- Tailor the difficulty level of the flashcards to the user's expertise (beginner, intermediate, advanced) if specified.
- Generate 10 flashcards based on the user's input, regardless of the topic.

Output the flashcards in the following JSON format:
[
  {
    "question": "What is a neural network?",
    "answer": "A neural network is a computational model inspired by the way neural networks in the human brain process information."
  },
  {
    "question": "Define supervised learning.",
    "answer": "Supervised learning is a type of machine learning where the model is trained on labeled data."
  }
]
  Make sure to provide the question and answer only in JSON format not in the text format
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