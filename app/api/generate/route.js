import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Stripe from 'stripe'

const systemPrompt = `
You are a versatile flashcard creator. Given a topic, number of cards, question type, answer type, and specific details, you will generate a set of flashcards. You can adapt to various subject matters and learning styles.

Return in the following JSON format
{
    "flashcards":{
        "front": str,
        "back": str
    }
}
`
export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.text()
  
    
    const completion = await openai.chat.completions.create({
        messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data },
        ],
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
    })

    // Parse the JSON response from the OpenAI API
    const flashcards = JSON.parse(completion.choices[0].message.content)

    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards)
  }