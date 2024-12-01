import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

 
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = "Generate a short, humorous random unique joke about farts suitable for all ages. Please provide joke content with a suitable image appropriate to the meaning of the joke";


    const result :any= await model.generateContent(prompt);
    const joke = result.response.text();


    console.log(result.response?.candidates[0].content)

    return NextResponse.json({ joke });
  } catch (error) {
    console.error("Error generating joke:", error);
    return NextResponse.json({ error: "Failed to generate joke" }, { status: 500 });
  }
}

