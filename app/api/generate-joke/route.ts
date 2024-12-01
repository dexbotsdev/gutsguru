import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

 
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = "Create a short, original, and family-friendly joke about farts that is unique and has never been used before. Each joke should have a clever twist or unexpected punchline, suitable for all ages. Avoid clichés and ensure the humor feels fresh and imaginative. Provide content that pairs well with a lighthearted, cartoon-style illustration to convey the joke's essence.";


    const result :any= await model.generateContent(prompt);
    const joke = result.response.text();


    console.log(result.response?.candidates[0].content)

    return NextResponse.json({ joke });
  } catch (error) {
    console.error("Error generating joke:", error);
    return NextResponse.json({ error: "Failed to generate joke" }, { status: 500 });
  }
}

