import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `
You're a flashcard Creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and Informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. Generate only 12 Flashcards.

Remember, the goal is to facilitate effective learning and retention of information through these flashcards.
Format output as JSON: [{ "question": "...", "answer": "..." }]
`;

export async function POST(req) {
  try {
    // Ensure that the request body contains the required field
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'Text field is required.' }, { status: 400 });
    }

    // Initialize the API client
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is missing.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Prepare prompt for the API
    const prompt = `${systemPrompt} Text: ${text}`;

    // Generate flashcards
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);

    // Parse the response
    let textResponse = result.response.text();
    textResponse = textResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    
    // Validate and parse JSON response
    let flashcards = JSON.parse(textResponse.trim());
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
