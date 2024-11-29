import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

 
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = "Generate a short, humorous joke about farts suitable for all ages. Please provide only the joke text without any additional commentary.";

    const result = await model.generateContent(prompt);
    const joke = result.response.text();

    return NextResponse.json({ joke });
  } catch (error) {
    console.error("Error generating joke:", error);
    return NextResponse.json({ error: "Failed to generate joke" }, { status: 500 });
  }
}

